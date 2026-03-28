Add-Type -AssemblyName System.Drawing
$filePath = "pics\professional_matte_m_logo_variant_1 (1).png"
$img = New-Object System.Drawing.Bitmap($filePath)

$bg = $img.GetPixel(0,0)
Write-Host "Background pixel at 0,0: R=$($bg.R) G=$($bg.G) B=$($bg.B) A=$($bg.A)"

$minX = $img.Width - 1
$minY = $img.Height - 1
$maxX = 0
$maxY = 0

for ($y = 0; $y -lt $img.Height; $y+=2) {
    for ($x = 0; $x -lt $img.Width; $x+=2) {
        $p = $img.GetPixel($x, $y)
        # if not background
        if ([Math]::Abs($p.R - $bg.R) -gt 10 -or [Math]::Abs($p.G - $bg.G) -gt 10 -or [Math]::Abs($p.B - $bg.B) -gt 10 -or [Math]::Abs($p.A - $bg.A) -gt 10) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

# Add 10px padding
$minX = [Math]::Max(0, $minX - 10)
$minY = [Math]::Max(0, $minY - 10)
$maxX = [Math]::Min($img.Width - 1, $maxX + 10)
$maxY = [Math]::Min($img.Height - 1, $maxY + 10)

$width = $maxX - $minX + 1
$height = $maxY - $minY + 1

Write-Host "Cropping to: X=$minX, Y=$minY, W=$width, H=$height"

if ($width -gt 0 -and $height -gt 0) {
    $rect = New-Object System.Drawing.Rectangle($minX, $minY, $width, $height)
    $bmp = New-Object System.Drawing.Bitmap($width, $height)
    $graphics = [System.Drawing.Graphics]::FromImage($bmp)
    $graphics.DrawImage($img, (New-Object System.Drawing.Rectangle(0, 0, $width, $height)), $rect, [System.Drawing.GraphicsUnit]::Pixel)
    $bmp.Save("$(Get-Location)\public\logo.png", [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $bmp.Dispose()
    Write-Host "Cropped image saved successfully to public\logo.png."
} else {
    Write-Host "Failed to find content bounds."
}
$img.Dispose()
