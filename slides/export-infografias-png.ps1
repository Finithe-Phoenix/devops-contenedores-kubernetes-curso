# export-infografias-png.ps1 - Regenera los assets del frontend a partir de los .pptx de infografias.
# Exporta cada lamina a PNG, copia los .pptx y arma el ZIP "descargar todo".
# Requiere Windows + Microsoft PowerPoint instalado.  Uso:  pwsh slides/export-infografias-png.ps1
$ErrorActionPreference = "Stop"
$slides = Split-Path -Parent $MyInvocation.MyCommand.Path
$root   = Split-Path -Parent $slides
$pub    = Join-Path $root "01-app\node\public"
$dl     = Join-Path $pub "downloads"

$decks = @(
  @{ f = "Infografias_Alumnos_ES.pptx";  dest = "$pub\infografias\es" },
  @{ f = "Student_Infographics_EN.pptx"; dest = "$pub\infografias\en" }
)

# --- 1) Validaciones a prueba de errores -------------------------------------
foreach ($d in $decks) {
  $src = Join-Path $slides $d.f
  if (-not (Test-Path $src)) {
    Write-Host "ERROR: no existe '$($d.f)'. Genera los PPTX primero:" -ForegroundColor Red
    Write-Host "       cd slides; node infographics.js" -ForegroundColor Yellow
    exit 1
  }
}
foreach ($d in @("$pub\infografias\es", "$pub\infografias\en", $dl)) {
  New-Item -ItemType Directory -Force -Path $d | Out-Null
}

# --- 2) Abrir PowerPoint via COM (con mensaje claro si no esta) ---------------
try {
  $ppt = New-Object -ComObject PowerPoint.Application -ErrorAction Stop
} catch {
  Write-Host "ERROR: no se pudo abrir Microsoft PowerPoint (COM)." -ForegroundColor Red
  Write-Host "Este exportador necesita PowerPoint instalado en Windows." -ForegroundColor Yellow
  Write-Host "Alternativas:" -ForegroundColor Yellow
  Write-Host "  - Instala PowerPoint, o" -ForegroundColor Yellow
  Write-Host "  - Convierte los .pptx a PNG con LibreOffice:" -ForegroundColor Yellow
  Write-Host '      soffice --headless --convert-to pdf Infografias_Alumnos_ES.pptx' -ForegroundColor DarkGray
  Write-Host "      (luego separa el PDF en PNG con pdftoppm/ImageMagick)" -ForegroundColor DarkGray
  exit 1
}

# --- 3) Exportar cada deck a PNG (libera el COM pase lo que pase) -------------
try {
  foreach ($d in $decks) {
    $pres = $ppt.Presentations.Open((Join-Path $slides $d.f), $true, $true, $false)
    try {
      $pres.Export($d.dest, "PNG", 1600, 900)
    } finally {
      $pres.Close()
    }
    # PowerPoint exporta como "DiapositivaN.PNG" / "SlideN.PNG"; renombramos a NN.png
    Get-ChildItem $d.dest -Filter "*.PNG" | ForEach-Object {
      $numStr = ($_.BaseName -replace '\D', '')
      if ($numStr) { Move-Item $_.FullName (Join-Path $d.dest ("{0:D2}.png" -f [int]$numStr)) -Force }
    }
    $n = (Get-ChildItem $d.dest -Filter *.png).Count
    Write-Host ("OK: $($d.dest) -> $n PNG") -ForegroundColor Green
  }
} finally {
  $ppt.Quit()
  [System.Runtime.InteropServices.Marshal]::ReleaseComObject($ppt) | Out-Null
}

# --- 4) Copiar PPTX y armar el ZIP "descargar todo" --------------------------
Copy-Item (Join-Path $slides "Infografias_Alumnos_ES.pptx")  $dl -Force
Copy-Item (Join-Path $slides "Student_Infographics_EN.pptx") $dl -Force
Compress-Archive -Path "$pub\infografias\es\*.png", "$pub\infografias\en\*.png", "$dl\Infografias_Alumnos_ES.pptx", "$dl\Student_Infographics_EN.pptx" -DestinationPath "$dl\infografias-todas.zip" -Force
Write-Host "Listo: PNGs + PPTX + ZIP en 01-app/node/public/" -ForegroundColor Cyan
