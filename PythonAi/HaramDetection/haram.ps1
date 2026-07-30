param(
    [Parameter(Position=0, Mandatory=$false)]
    [string]$ImagePath,
    [switch]$Json,
    [switch]$Html,
    [switch]$Stdin,
    [string]$Config,
    [string]$Output
)

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$VenvPython = Join-Path $ScriptDir ".venv-cuda\Scripts\python.exe"
$MainPy = Join-Path $ScriptDir "main.py"

if (-not (Test-Path $VenvPython)) {
    Write-Error "Virtual environment not found at $VenvPython. Run setup first."
    exit 1
}

$argsList = @()

if ($ImagePath) {
    $argsList += "`"$ImagePath`""
}
if ($Json) {
    $argsList += "--json"
}
if ($Html) {
    $argsList += "--html"
}
if ($Stdin) {
    $argsList += "--stdin"
}
if ($Config) {
    $argsList += "--config", "`"$Config`""
}
if ($Output) {
    $argsList += "--output", "`"$Output`""
}

$fullCmd = "& `"$VenvPython`" `"$MainPy`" $($argsList -join ' ') 2>&1"
Invoke-Expression $fullCmd
