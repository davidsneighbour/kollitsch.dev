{{- $algolia := index site.Data.dnb "search-algolia" -}}

{{- with $algolia.config.appId -}}
const appId = "{{ . }}";
{{- else -}}
{{- errorf "appId parameter for search-algolia undefined" -}}
{{- end -}}
{{- with $algolia.config.apiKey -}}
const apiKey = "{{ . }}";
{{- else -}}
{{- errorf "apiKey parameter for search-algolia undefined" -}}
{{- end -}}
{{- with $algolia.config.indexName -}}
const indexName = "{{ . }}";
{{- else -}}
{{- errorf "indexName parameter for search-algolia undefined" -}}
{{- end -}}
{{- with $algolia.config.numberLocale -}}
const numberLocale = "{{ . | default "en" }}";
{{- end -}}
