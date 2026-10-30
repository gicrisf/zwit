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
