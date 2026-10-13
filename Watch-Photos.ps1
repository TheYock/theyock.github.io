$ErrorActionPreference = 'Stop'
$siteFolder = $PSScriptRoot
$listPath = Join-Path $siteFolder 'project-photos.js'

function Update-Photos {
    $photos = [ordered]@{}
    foreach ($project in @('asher', 'openrealm', 'haunted-house-director', 'tooling')) {
        $folder = Join-Path $siteFolder "images/$project"
        $photos[$project] = @(Get-ChildItem -LiteralPath $folder -File |
            Where-Object { $_.Extension -match '^\.(png|jpe?g|gif|webp|avif|svg)$' } |
            Sort-Object Name | ForEach-Object { $_.Name })
    }
    $content = '// Automatically generated from the images folders. Do not edit.' + "`r`nwindow.projectPhotos = " + ($photos | ConvertTo-Json -Depth 4 -Compress) + ';'
    if (!(Test-Path -LiteralPath $listPath) -or [IO.File]::ReadAllText($listPath) -ne $content) {
        [IO.File]::WriteAllText($listPath, $content, [Text.UTF8Encoding]::new($false))
        Write-Host 'Photo list updated. Refresh your browser to see changes.'
    }
}

Update-Photos
Start-Process (Join-Path $siteFolder 'portfolio.html')
Write-Host 'Drop pictures into the matching project folder inside images.'
Write-Host 'Leave this window open while adding photos. Refresh the browser after changes.'
Write-Host 'Close this window when finished.'
while ($true) {
    Start-Sleep -Seconds 2
    Update-Photos
}
