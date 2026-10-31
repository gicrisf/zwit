+++
title = "Org Capture Setup"
description = "Create new Zola posts with an Org capture template."
weight = 60

[extra]
lead = "Generate the post heading and EXPORT_FILE_NAME automatically instead of typing them for every new entry."
toc = true
adapted_from = "ox-hugo"
adapted_url = "https://ox-hugo.scripter.co/doc/org-capture-setup/"
+++

## Capture template

Define a template function and register it with `org-capture-templates`:

```elisp
(with-eval-after-load 'org-capture
  (defun my/ox-zola-capture-template ()
    "Return an `org-capture' template for a new Zola post."
    (let* ((title (read-from-minibuffer "Post Title: "))
           (fname (org-hugo-slug title)))
      (mapconcat #'identity
                 `(,(concat "* TODO " title)
                   ":PROPERTIES:"
                   ,(concat ":EXPORT_FILE_NAME: " fname)
                   ":END:"
                   "%?\n")
                 "\n")))

  (add-to-list 'org-capture-templates
               '("z" "Zola post" entry
                 (file+olp "all-posts.org" "Blog Ideas")
                 (function my/ox-zola-capture-template))))
```

`org-hugo-slug` is inherited from the exporter dependency and turns the title into the post slug.

## Page bundles

For a Zola page bundle, export `index.md` inside a named directory:

```elisp
(defun my/ox-zola-bundle-capture-template ()
  "Return an `org-capture' template for a new Zola page bundle."
  (let* ((title (read-from-minibuffer "Post Title: "))
         (fname (org-hugo-slug title)))
    (mapconcat #'identity
               `(,(concat "* TODO " title)
                 ":PROPERTIES:"
                 ,(concat ":EXPORT_ZOLA_BUNDLE: " fname)
                 ":EXPORT_FILE_NAME: index"
                 ":END:"
                 "%?\n")
               "\n")))
```

Images and other assets can then live beside the exported `index.md`.

## Dates

If you log `DONE` timestamps, switch the new post to `DONE` and the `CLOSED` property supplies the date.

If you do not use `org-log-done`, insert an explicit date in the template:

```elisp
(let* ((date (format-time-string (org-time-stamp-format :long :inactive)
                                 (org-current-time)))
       (title (read-from-minibuffer "Post Title: "))
       (fname (org-hugo-slug title)))
  (mapconcat #'identity
             `(,(concat "* TODO " title)
               ":PROPERTIES:"
               ,(concat ":EXPORT_FILE_NAME: " fname)
               ,(concat ":EXPORT_DATE: " date)
               ":END:"
               "%?\n")
             "\n"))
```
