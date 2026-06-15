# export-infografias-png.ps1 — Regenera los assets del frontend a partir de los .pptx de infografías.
# Exporta cada lámina a PNG, copia los .pptx y arma el ZIP "descargar todo".
# Requiere Windows + Microsoft PowerPoint instalado. Uso:  pwsh slides/export-infografias-png.ps1
$ErrorActionPreference = "Stop"
$slides = Split-Path -Parent $MyInvocation.MyCommand.Path
$root   = Split-Path -Parent $slides
$pub    = Join-Path $root "01-app\node\public"
$dl     = Join-Path $pub "downloads"
foreach ($d in @("$pub\infografias\es", "$pub\infografias\en", $dl)) { New-Item -ItemType Directory -Force -Path $d | Out-Null }

$decks = @(
  @{ f = "Infografias_Alumnos_ES.pptx";  dest = "$pub\infografias\es" },
  @{ f = "Student_Infographics_EN.pptx"; dest = "$pub\infografias\en" }
)
$ppt = New-Object -ComObject PowerPoint.Application
foreach ($d in $decks) {
  $pres = $ppt.Presentations.Open((Join-Path $slides $d.f), $true, $true, $false)
  $pres.Export($d.dest, "PNG", 1600, 900)
  $pres.Close()
  # PowerPoint exporta como "DiapositivaN.PNG" / "SlideN.PNG"; renombramos a NN.png
  Get-ChildItem $d.dest -Filter "*.PNG" | ForEach-Object {
    $numStr = ($_.BaseName -replace '\D', '')
    if ($numStr) { Move-Item $_.FullName (Join-Path $d.dest ("{0:D2}.png" -f [int]$numStr)) -Force }
  }
  Write-Output ("$($d.dest) -> $((Get-ChildItem $d.dest -Filter *.png).Count) PNG")
}
$ppt.Quit()
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($ppt) | Out-Null

Copy-Item (Join-Path $slides "Infografias_Alumnos_ES.pptx")  $dl -Force
Copy-Item (Join-Path $slides "Student_Infographics_EN.pptx") $dl -Force
Compress-Archive -Path "$pub\infografias\es\*.png", "$pub\infografias\en\*.png", "$dl\Infografias_Alumnos_ES.pptx", "$dl\Student_Infographics_EN.pptx" -DestinationPath "$dl\infografias-todas.zip" -Force
Write-Output "Listo: PNGs + PPTX + ZIP en 01-app/node/public/"
