# Download das fontes Montserrat
$mediumUrl = "https://github.com/JulietaUla/Montserrat/raw/master/fonts/ttf/Montserrat-Medium.ttf"
$boldUrl = "https://github.com/JulietaUla/Montserrat/raw/master/fonts/ttf/Montserrat-Bold.ttf"

$mediumOutput = "public\fonts\Montserrat-Medium.ttf"
$boldOutput = "public\fonts\Montserrat-Bold.ttf"

$webClient = New-Object System.Net.WebClient

try {
    Write-Output "Baixando Montserrat Medium..."
    $webClient.DownloadFile($mediumUrl, $mediumOutput)
    
    Write-Output "Baixando Montserrat Bold..."
    $webClient.DownloadFile($boldUrl, $boldOutput)
    
    Write-Output "Fontes baixadas com sucesso!"
} catch {
    Write-Output "Erro ao baixar fontes: $_"
}
