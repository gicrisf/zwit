(function () {
  'use strict';

  var VERTEX_SHADER = [
    'attribute vec2 a_position;',
    '',
    'void main() {',
    '  gl_Position = vec4(a_position, 0.0, 1.0);',
    '}'
  ].join('\n');

  var FRAGMENT_SHADER = `
precision highp float;

uniform sampler2D u_scene;       // display-referred scene
uniform vec2  u_resolution;      // output buffer size, in pixels
uniform vec2  u_uv_scale;        // object-fit: cover texture crop
uniform vec2  u_uv_offset;       // object-fit: cover texture offset
uniform float u_grain_time;      // seconds
uniform float u_night;           // 0.0 = day, 1.0 = night
uniform float u_noise_scale;     // 1.0 normally; 1.7 on low-DPI screens
uniform float u_intensity;       // mix(0.4, 0.065, u_night)

float gaussian(float z, float u, float o) {
  return (1.0 / (o * sqrt(2.0 * 3.1415))) *
         exp(-(((z - u) * (z - u)) / (2.0 * (o * o))));
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution * u_uv_scale + u_uv_offset;
  vec3 color = texture2D(u_scene, uv).rgb;

  // Display-referred luminance, exactly as the site does it.
  float gray = dot(color, vec3(0.299, 0.587, 0.114));
  float gray0 = gray;

  // The site hashes in buffer-pixel space, not texture-UV space.
  vec2 noiseUv = gl_FragCoord.xy * u_noise_scale / u_resolution;
  float seed = dot(noiseUv, vec2(12.9898, 78.233));
  float noise = fract(sin(seed) * 43758.5453 + u_grain_time * 1.5);

  // The site's Gaussian is centered at zero; it mostly lifts dark pixels.
  float variance = mix(0.75, 0.6, u_night);
  noise = gaussian(noise, 0.0, variance * variance);

  gray += noise * (1.0 - gray) * u_intensity;
  gray = clamp(gray, 0.0, 1.0);

  // Keep the input color: add only the grain delta.
  float delta = gray - gray0;
  gl_FragColor = vec4(clamp(color + delta, 0.0, 1.0), 1.0);
}
`;

  var NIGHT = 0.0;
  var INTENSITY = 0.4 + (0.065 - 0.4) * NIGHT;

  function sameOriginUrl(src) {
    try {
      var url = new URL(src, window.location.href);
      if (url.origin === window.location.origin) return url.href;
      return window.location.origin + url.pathname + url.search;
    } catch (e) {
      return src;
    }
  }

  function loadImage(src) {
    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.onload = function () {
        resolve(img);
      };
      img.onerror = reject;
      img.src = src;
    });
  }

  function compileShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      var info = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error('Shader compile failed: ' + info);
    }
    return shader;
  }

  function createProgram(gl, vertexSource, fragmentSource) {
    var vertex = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
    var fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
    var program = gl.createProgram();

    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      var info = gl.getProgramInfoLog(program);
      gl.deleteProgram(program);
      throw new Error('Program link failed: ' + info);
    }

    return program;
  }

  function getContext(canvas) {
    var options = {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
      powerPreference: 'low-power'
    };

    return canvas.getContext('webgl', options) ||
      canvas.getContext('experimental-webgl', options);
  }

  function init(bg, image, canvas) {
    var source = image.currentSrc || image.src;
    var textureSource = sameOriginUrl(source);

    return loadImage(textureSource).then(function (textureImage) {
      var gl;

      try {
        gl = getContext(canvas);
      } catch (e) {
        return false;
      }

      if (!gl) return false;

      var program;

      try {
        program = createProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER);
      } catch (e) {
        return false;
      }

      var position = gl.getAttribLocation(program, 'a_position');
      var buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1.01, -1.01,
         3.03, -1.01,
        -1.01,  3.03
      ]), gl.STATIC_DRAW);

      var uniforms = {
        scene: gl.getUniformLocation(program, 'u_scene'),
        resolution: gl.getUniformLocation(program, 'u_resolution'),
        uvScale: gl.getUniformLocation(program, 'u_uv_scale'),
        uvOffset: gl.getUniformLocation(program, 'u_uv_offset'),
        grainTime: gl.getUniformLocation(program, 'u_grain_time'),
        night: gl.getUniformLocation(program, 'u_night'),
        noiseScale: gl.getUniformLocation(program, 'u_noise_scale'),
        intensity: gl.getUniformLocation(program, 'u_intensity')
      };

      var texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

      try {
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          textureImage
        );
      } catch (e) {
        return false;
      }

      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

      var imageWidth = textureImage.naturalWidth || textureImage.width;
      var imageHeight = textureImage.naturalHeight || textureImage.height;
      if (!imageWidth || !imageHeight) return false;

      var raf = 0;
      var lost = false;
      var startTime = 0;

      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
      gl.uniform1i(uniforms.scene, 0);
      gl.uniform1f(uniforms.night, NIGHT);
      gl.uniform1f(uniforms.intensity, INTENSITY);

      function resize() {
        if (lost) return;

        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        var width = Math.max(1, Math.round(window.innerWidth * dpr));
        var height = Math.max(1, Math.round(window.innerHeight * dpr));

        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
        }

        gl.viewport(0, 0, width, height);
        gl.uniform2f(uniforms.resolution, width, height);

        var cover = Math.max(width / imageWidth, height / imageHeight);
        var scaleX = width / (imageWidth * cover);
        var scaleY = height / (imageHeight * cover);

        gl.uniform2f(uniforms.uvScale, scaleX, scaleY);
        gl.uniform2f(uniforms.uvOffset, (1 - scaleX) / 2, (1 - scaleY) / 2);

        var noiseScale = (window.devicePixelRatio || 1) <= 1 ? 1.7 : 1.0;
        gl.uniform1f(uniforms.noiseScale, noiseScale);
      }

      function draw(now) {
        if (!startTime) startTime = now;
        gl.uniform1f(uniforms.grainTime, (now - startTime) / 1000);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }

      function frame(now) {
        if (lost) return;
        draw(now);
        raf = window.requestAnimationFrame(frame);
      }

      function stop() {
        if (raf) window.cancelAnimationFrame(raf);
        raf = 0;
      }

      canvas.addEventListener('webglcontextlost', function (event) {
        event.preventDefault();
        lost = true;
        stop();
        bg.classList.remove('site-bg--webgl');
        canvas.classList.remove('is-loaded');
        image.classList.add('is-loaded');
      }, false);

      window.addEventListener('resize', resize, false);

      resize();
      draw(0);
      startTime = 0;
      bg.classList.add('site-bg--webgl');
      canvas.classList.add('is-loaded');
      raf = window.requestAnimationFrame(frame);

      return true;
    }).catch(function () {
      return false;
    });
  }

  window.siteBgGrain = {
    init: init
  };
})();
