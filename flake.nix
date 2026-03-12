{
  description = "Notion Enhancer wrapped as an Electron Desktop App";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = { self, nixpkgs }:
    let
      supportedSystems = [ "x86_64-linux" "aarch64-linux" ];
      forAllSystems = nixpkgs.lib.genAttrs supportedSystems;
      pkgsFor = system: import nixpkgs { inherit system; };
    in
    {
      packages = forAllSystems (system:
        let
          pkgs = pkgsFor system;
        in
        {
          default = pkgs.stdenv.mkDerivation {
            pname = "notion-enhanced";
            version = "0.11.1";
            src = ./.;

            nativeBuildInputs = [ pkgs.copyDesktopItems pkgs.makeWrapper ];

            installPhase = ''
              runHook preInstall

              mkdir -p $out/bin $out/share/notion-enhanced
              cp -r src assets desktop.js package.json $out/share/notion-enhanced/

              makeWrapper ${pkgs.electron}/bin/electron $out/bin/notion-enhanced \
                --add-flags "$out/share/notion-enhanced/desktop.js"

              mkdir -p $out/share/pixmaps
              cp assets/icon.png $out/share/pixmaps/notion-enhanced.png

              runHook postInstall
            '';

            desktopItems = [
              (pkgs.makeDesktopItem {
                name = "notion-enhanced";
                exec = "notion-enhanced";
                icon = "notion-enhanced";
                desktopName = "Notion Enhanced";
                genericName = "Notes and Tasks";
                categories = [ "Office" "Utility" ];
                startupWMClass = "notion-enhancer";
              })
            ];
          };
        }
      );
    };
}
