{{/* Nombre base de los recursos */}}
{{- define "academia-app.name" -}}
{{- default .Chart.Name .Values.nameOverride -}}
{{- end -}}

{{/* Etiquetas comunes para todos los recursos */}}
{{- define "academia-app.labels" -}}
app: {{ include "academia-app.name" . }}
app.kubernetes.io/name: {{ include "academia-app.name" . }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
helm.sh/chart: {{ .Chart.Name }}-{{ .Chart.Version }}
{{- end -}}
