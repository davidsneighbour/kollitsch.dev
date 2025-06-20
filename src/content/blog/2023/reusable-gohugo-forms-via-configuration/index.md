---
title: "Reusable GoHugo Forms via Configuration"
linkTitle: "Reusable GoHugo Forms via Configuration"
description: "A write-up of the process of creating reusable forms in GoHugo via configuration files."
date: "2023-10-22T17:29:40+07:00"
resources:
  - title: "Carefully implemented forms"
    src: "header.jpg"
tags:
  - "gohugo"
  - "shortcode"
  - "howto"
  - "100daystooffload"
unsplash:
  imageid: "abcdefghijk"
fmContentType: "blog"
cover: "./header.jpg"
---

A while back (pre-COVID-19 era), I had the idea to create a [GoHugo](https://gohugo.io) module that would allow me to create forms via configuration files. I also wanted to easily translate the form into different languages. I sketched out a solution but never got around to implementing it. I recently stumbled upon the scratch pad and decided to finally implement it. This article is a write-up of the process, and the first final result can be seen with [the contact form](/connect) on this site.

Some quick sidenotes:

* I added settings required for [Netlify's form processing](https://docs.netlify.com/forms/setup/).
* Many classes and controls are based on [Bootstrap 5](https://getbootstrap.com/docs/5.0/forms/overview/). It is easy to adapt the form to other CSS frameworks.
* Currently, many attributes are printed as they are defined. No sanitation is done. So, the form is as safe as your configuration/translation files are.

I added the shortcode to my shortcodes module. That makes it easier to transport to other sites I am working on. At the time of writing this article, the files in use are the following:

* [`config/_default/params.toml`](https://github.com/davidsneighbour/hugo-modules/blob/4d7d94314c38f990b625bd0aac2c2d7d030c4927/modules/shortcodes/config/_default/params.toml) - the configuration
* [`i18n/en.toml`](https://github.com/davidsneighbour/hugo-modules/blob/4d7d94314c38f990b625bd0aac2c2d7d030c4927/modules/shortcodes/i18n/en.toml) - the internationalization
* [`layouts/shortcodes/form.html`](https://github.com/davidsneighbour/hugo-modules/blob/4d7d94314c38f990b625bd0aac2c2d7d030c4927/modules/shortcodes/layouts/shortcodes/form.html) - the form generation
* [`layouts/partials/func/getRandomString.html`](https://github.com/davidsneighbour/hugo-modules/blob/4d7d94314c38f990b625bd0aac2c2d7d030c4927/modules/functions/layouts/partials/func/getRandomString.html) - random string generator used (part of the functions module)

Things might change because this is a "work in progress" with plenty of features I want to add. But for now, let's dive into the details of the first incarnation: A contact form.

## Configuration in `config/_default/params.toml`

```toml
[dnb.forms.contactform]
id = "contactform"
labelling = "i18n"
groups = true
groupstyle = "grid"
```

All config options I have implemented in my modules live in the `dnb` namespace. The `dnb.forms` section defines the configuration for the form shortcode. Lastly, the `contactform` part is the identifier for the form we are using. This could be any string and is used to separate the configurations for different forms.

The `id` is used as the `id` and `name` attribute for the form.

The `labelling` option defines how the labels and names for the form fields are generated. The default is `i18n`, meaning the labels are translated using the `i18n` function. The other option would be `inline` and directly use the field's `name` and `label` attributes (not implemented yet).

The `groups` option defines whether the form fields are grouped. If `groups` is set to `true`, then the `groupstyle` option defines how the fields are grouped. The default is `grid`, meaning the fields are grouped in a grid layout. Another option would be `fieldset`, which would group the fields in fieldsets (not implemented yet).

Two options I left out are `method` (defaults to `post`) and `action` (defaults to "" (empty)) that set their form tag attribute counterparts.

```toml
[dnb.forms.contactform.attributes]
data-netlify = "true"
netlify-honeypot = "%random%"
class = "mb-6"
```

The `attributes` section defines the attributes for the form tag. Every option will be added as `key="value"`.

As you can see, I am using [Netlify's form processing](https://docs.netlify.com/forms/setup/) as the delivery method for my form. For that to work, you must add attributes to the form tag. The `data-netlify` attribute is used to enable Netlify's form handling. The `netlify-honeypot` attribute is used to define the name of the honeypot field.

The `class` attribute defines the CSS classes for the form.

The keys and values in this section can be *anything* you want. The only important thing is that the values are strings enclosed in double quotation marks. If you wish to use a string containing quotation marks, you must use backslashes before them. I can't think of any use case for this.

```toml
[[dnb.forms.contactform.fields.1]]
name = "shortcodes.form.fieldnames.name"
label = "shortcodes.form.name"
type = "text"
required = true

[[dnb.forms.contactform.fields.1]]
type = "special"
html = "<div data-netlify-recaptcha=\"true\"></div>"

[[dnb.forms.contactform.fields.1]]
type = "invisible"
name = "%random%"

[[dnb.forms.contactform.fields.2]]
name = "shortcodes.form.fieldnames.message"
label = "shortcodes.form.message"
type = "textarea"
required = true

[dnb.forms.contactform.fields.2.options]
rows = 8
```

Now, the process of adding form fields. Because I only implemented the `groups/grid` mode (fields are part of a group and will be contained in a container that can be styled via CSS Grid), I will only explain how to configure this mode.

The `fields` section is an array of arrays. The outer array defines the groups, and the inner arrays represent the fields. The order of the fields is how they will be rendered. The group name can be anything.

Each field can have the following attributes:

* `name` - the field's name, used as `id` and `name` attribute. If `labelling` is set to `i18n`, the name will be translated using the `i18n` function. (As I am writing this, I don't know if that makes much sense for the name field, but I will leave it in for now. Be careful to not use any special characters and spaces in the name.) The name MUST be unique in the whole form.
* `label` - the label of the field. If `labelling` is set to `i18n`, the label will be translated using the `i18n` function.
* `type` - the type of the field. The default is `text`. All HTML field types (like `date`, `tel`, etc.) are supported. In addition, the following fields are supported:
  * `textarea` - a textarea field. The `rows` option can define the number of rows. You can design the field via CSS.
  * `invisible` - an input field that is not visible. This can be used as a honeypot for antispam measures. Note that this field is not of the type `hidden`, but a regular text field. The name's `%random` attribute is replaced with a random string.
  * `special` - a field defined via the `html` attribute. Note that this is added as is and is not escaped. So be careful with this one. Quotation marks need to be escaped with a backslash.
* `required` - if set to `true`, the field will be marked as required. The default is `false`.
* `class` - the CSS classes for the field. The default is `form-control`. This is only used for the `text` (HTML types) and `textarea` fields.
* `options` - a section that can be used to define options for the field. Only the `rows` option for the `textarea` field is currently supported.

```toml
[[dnb.forms.contactform.buttons]]
type = "submit"
name = "shortcodes.form.fieldnames.submit"
label = "shortcodes.form.submit"
class = "btn btn-primary"
```

The `buttons` section is an array of buttons. Each button can have the following attributes:

* `type` - the type of the button. The default is `submit`. All HTML button types are supported.
* `name` - the name of the button. If `labelling` is set to `i18n`, the name will be translated using the `i18n` function.
* `label` - the label of the button. If `labelling` is set to `i18n`, the label will be translated using the `i18n` function.
* `class` - the CSS classes for the button.

This needs much improvement. For instance, we currently do not have `upload`, `select`, `options`, `checkbox`, and `radio` fields. But this is a good start. I also think that with some use of the brain, the `upload`, `checkbox`, and `radio` fields can be used with the existing system.

## Internationalization in `i18n/en.toml`

The `labelling` attribute in the form configuration preceding sets the way of labelling the form to `i18n`. All fields can be configured via `i18n/en.toml`.

```toml
[shortcodes.contactform.name]
description = "Form label for the name field"
other = "Your Name"

# … (more translations for other form elements)

[shortcodes.contactform.fieldnames.name]
other = "Name"
[shortcodes.contactform.fieldnames.email]
other = "Email"
[shortcodes.contactform.fieldnames.subject]
other = "Subject"
[shortcodes.contactform.fieldnames.message]
other = "Message"
```

For instance, in Netlify's form processing, the field name is the key for the email sent to the recipient. So, having the field names in the `i18n` system makes sense. Because currently, there is no option other than the `i18n` method for labelling the form, so we will have to add an i18n configuration for all form elements.

## Form generation in `layouts/shortcodes/form.html`

This layout file uses the configuration defined in `params.toml` to generate the HTML for the form. It is long, so let's break down the essential parts. The [first few lines](https://github.com/davidsneighbour/hugo-modules/blob/4d7d94314c38f990b625bd0aac2c2d7d030c4927/modules/shortcodes/layouts/shortcodes/form.html#L1-L13) are used to get the configuration from `params.toml` above and to set some defaults.

Then, the form itself is generated. As I wrote above, the only implemented `groups` method is `grid`, so lines 6-14 are building the containers and fields for the form, and lines 16-24 are creating the buttons section of the form. Both sections use inline partials, which I will explain below.

```go
<form {{ $formAttributes | safe.HTMLAttr }} class="{{ $formConfig.classes | safeHTMLAttr }}">
  {{- $groups := $formConfig.groups | default "false" -}}
  {{- if eq $groups "false" -}}
    {{- /* ungrouped forms */ -}}
  {{- else -}}
    <div class="row g-3">
      {{ range $formConfig.fields }}
        <div class="col col-sm-6">
          {{ range . }}
            {{ partial "dnb-forms-inlinetemplate-formfield" . }}
          {{ end }}
        </div>
      {{ end }}
    </div>
  {{- end -}}
  <div class="row">
    {{ range $formConfig.buttons -}}
      <div class="col-12">
        {{ range $formConfig.buttons }}
          {{ partial "dnb-forms-inlinetemplate-button" . }}
        {{ end }}
      </div>
    {{ end }}
  </div>
</form>
```

The actual execution of the form field and button creation is done by [inline partials](https://gohugo.io/templates/partials/#inline-partials). I never used inline partials before, but for this use, that made much more sense than moving these actions into ranged partials.

I don't really like inline partials too much because of the following sentence in the documentation:

> … remember that template namespace is global, so you need to make sure that the names are unique to avoid conflicts.

This means it's a gamble if you are not obsessively specific with your partial name (like the ones I used here). It also means that the partial is not confined to the file it is used in. I can't wrap my head around this yet. Besides having everything nice and neatly in one file, I don't see any advantage of inline partials.

Let's keep using them for now so the code is within a single file.

```go
{{ define "partials/dnb-forms-inlinetemplate-formfield" }}
  {{- $fieldRequired := .required | default "false" -}}
  {{- if eq $fieldRequired "true" -}}
    {{- $fieldRequired = "required" -}}
  {{- else -}}
    {{- $fieldRequired = "" -}}
  {{- end -}}
  {{- $fieldId := i18n .name | lower -}}
  {{- $fieldType := .type | default "text" -}}

  {{- if eq "invisible" $fieldType -}}

    {{- $random := partial "func/getRandomString.html" (dict "limit" 10) -}}
    <label class="d-none invisible" for="{{- $random -}}">{{- $random -}}</label>
    <input type="text" name="{{- $random -}}" id="{{- $random -}}" class="d-none invisible">

  {{- else if eq "special" $fieldType -}}

    {{- .html | safeHTML -}}

  {{- else if eq "textarea" $fieldType -}}

      <div class="mb-3">
        <label class="form-label"
                for="{{- $fieldId -}}">
          {{ i18n .label }}
        </label>
        <textarea class="form-control"
                  id="{{- $fieldId -}}"
                  name="{{- $fieldId -}}"
                  rows="{{- .options.rows | default 5 -}}"
                  {{ $fieldRequired | safe.HTMLAttr }}></textarea>
      </div>

  {{- else -}}

    <div class="mb-3">
      <label class="form-label"
              for="{{ $fieldId }}">
        {{ i18n .label }}
      </label>
      <input class="form-control"
              name="{{- $fieldId -}}"
              id="{{- $fieldId -}}"
              type="{{- .type -}}"
              {{ $fieldRequired | safe.HTMLAttr }}>
    </div>

  {{- end -}}
{{ end }}
```

This partial checks the type of the field and renders the appropriate HTML. The `textarea` field is a bit more complex because it has an options section. Other fields will be added later. As I wrote above, the `special` field is rendered *as is*, so be careful with that one.

Then there is the button partial:

```go
{{- define "partials/dnb-forms-inlinetemplate-button" -}}
  {{- $buttonAttributes := printf "class=\"%s\" type=\"%s\" value=\"%s\""
      .class
      (.type | default "submit")
      (i18n .label) -}}
  <div class="mb-3">
    <input {{ $buttonAttributes | safeHTMLAttr  -}}>
  </div>
{{- end -}}
```

That one is pretty simple. It creates the button with the attributes defined in the configuration.

## A note on the `getRandomString` function

The `getRandomString` function generates random strings for the honeypot field. It is defined in [`layouts/partials/func/getRandomString.html`](https://github.com/davidsneighbour/hugo-modules/blob/main/modules/functions/layouts/partials/func/getRandomString.html) in my functions module. It is a reliable, reusable function in my arsenal that is used in a lot of places.

```go
{{ $seed := printf "%s%s" site.Title now.Unix }}
{{ if isset . "seed" }}
  {{ $seed = .seed }}
{{ end }}
{{ $limit := .limit | default 12 }}
{{ $random := delimit (shuffle (split (md5 $seed) "" )) "" }}
{{ return substr $random 0 $limit }}
```

This is an excellent way to quickly create a random string for any requirements.

```go
{{- $random := partialCached "func/getRandomString" (dict "limit" 8) -}}
{{- $random := partialCached "func/getRandomString" . -}}
```

* calling without parameters returns 12 characters
* call with a `limit` parameter to select the amount of characters returned
* call with a `seed` parameter will use that string instead of the site.Title to
  create the random string
* call with `partialCached` and a unique seed to reuse the random string

## The result

This all looks more complicated than it is. The result is a form that can be configured via `params.toml` and translated via `i18n/en.toml`. The form can be used in any content file by adding the shortcode:

```go
{{</* form id="contactform" */>}}
```

You can see it live on [my contact page](/connect). Not that you ever would fill a contact form and send it, actually ;]

## That's all for now

Thank you for reading all this (or scrolling down to the end). The TLDR is that I have created a rudimentary shortcode that enables you to build a form by adding some configuration and, if you wish, some `i18n` setup without touching the code itself.

There are plenty of things that can be improved. There are plenty of things that can be added. For instance, the whole CSS class system could be put into an internal configuration to replace it with another CSS framework.

But for now, I am happy with the result. The next step will be to use the shortcode for other websites I am working on. I have, for instance, a booking form for holiday tours in mind that will test the limits and future requirements of this shortcode. I will post an update when I have implemented that.
