// Auto-generated code. Do not edit.
namespace myTiles {
    //% fixedInstance jres blockIdentity=images._tile
    export const transparency16 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile1 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile3 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile4 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile5 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile7 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile8 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile2 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile6 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile9 = image.ofBuffer(hex``);

    helpers._registerFactory("tilemap", function(name: string) {
        switch(helpers.stringTrim(name)) {
            case "level":
            case "level1":return tiles.createTilemap(hex`1000100004040404040404040404040404040404040404040404040404040404040404040404040707040707040707040707040404040101010101010101010101010104040501010101010101010101010101030404010101010606040808010101010404040101010106060408080101010103040401010101010101010101010101040409010101010101010101010101010304040101010101010101010101010104040402040404040405040404040405040101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101`, img`
2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 
2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 
2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 
2 2 . . . . . . . . . . . . . 2 
2 2 . . . . . . . . . . . . . 2 
2 2 . . . . 2 2 2 2 2 . . . . 2 
2 2 . . . . 2 2 2 2 2 . . . . 2 
2 2 . . . . . . . . . . . . . 2 
2 2 . . . . . . . . . . . . . 2 
2 2 . . . . . . . . . . . . . 2 
2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
`, [myTiles.transparency16,myTiles.tile1,myTiles.tile3,myTiles.tile4,myTiles.tile5,myTiles.tile7,myTiles.tile8,myTiles.tile2,myTiles.tile6,myTiles.tile9], TileScale.Sixteen);
        }
        return null;
    })

    helpers._registerFactory("tile", function(name: string) {
        switch(helpers.stringTrim(name)) {
            case "transparency16":return transparency16;
            case "TTFloor":
            case "tile1":return tile1;
            case "TRegister":
            case "tile3":return tile3;
            case "TStove":
            case "tile4":return tile4;
            case "TCounter":
            case "tile5":return tile5;
            case "TTrashcan":
            case "tile7":return tile7;
            case "TWorkstation":
            case "tile8":return tile8;
            case "TSpawner":
            case "tile2":return tile2;
            case "TChoppingBoard":
            case "tile6":return tile6;
            case "TBoxingStation":
            case "tile9":return tile9;
        }
        return null;
    })

}
// Auto-generated code. Do not edit.
