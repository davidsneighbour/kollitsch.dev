{{ with site.Params.dnb }}
  {{ range $key, $values := . }}
    {{ if index $values "config" "plugins" "js" "imports" }}
      {{ range $values.config.plugins.js.imports }}
        {{ . }}
      {{ end }}
    {{ end }}
  {{ end }}
  {{ range $key, $values := . }}
    {{ if index $values "config" "plugins" "js" "calls" }}
      {{ range $values.config.plugins.js.calls }}
        {{ . }}
      {{ end }}
    {{ end }}
  {{ end }}
{{ end }}
