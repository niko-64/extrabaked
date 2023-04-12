namespace SpriteKind {
    export const Ingredient = SpriteKind.create()
    export const ClickA = SpriteKind.create()
    export const ClickB = SpriteKind.create()
    export const Pizza = SpriteKind.create()
}


//Ingredient Setup
enum IngredientTypes {
    Dough = 0,
    Sauce = 1,
    Cheese = 2,
    Pepperoni = 3,
    Sausage = 4,
    Spinach = 5,
    Olives = 6,
    Mushrooms = 7,
}

enum IngredientStates {
    Raw = 0,
    Chopped = 1,
    OnPizza = 2,
    Cooked = 3
}

const ingredientSpriteTable = [
    [
        assets.image`IDough`, 
        null,
        assets.image`PzRawDough`, 
        assets.image`PzDough`
    ],
    [
        assets.image`ISauce`,
        null,
        assets.image`PzRawSauce`,
        assets.image`PzSauce`
    ],
    [
        assets.image`ICheese`,
        assets.image`IChoppedCheese`,
        assets.image`PzRawCheese`,
        assets.image`PzCheese`
    ],
    [
        assets.image`IPepperoni`,
        assets.image`IChoppedPepperoni`,
        assets.image`PzPepperoni`,
        null
    ],
    [
        assets.image`ISausage`,
        assets.image`IChoppedSausage`,
        assets.image`PzSausage`,
        null
    ],
    [
        assets.image`ISpinach`,
        assets.image`IChoppedSpinach`,
        assets.image`PzSpinach`,
        null
    ],
    [
        assets.image`IOlives`,
        assets.image`IChoppedOlives`,
        assets.image`PzOlives`,
        null
    ],
    [
        assets.image`IMushroom`,
        assets.image`IChoppedMushrooms`,
        assets.image`PzMushrooms`,
        null
    ]
]

let ingredientsInGame = [] as GameItem[];

function createIngredient (_item: IngredientTypes, _state: IngredientStates){
    let _newIngredient = new GameItem(_item, _state)
    ingredientsInGame.push(_newIngredient)
    return _newIngredient
}

class GameItem {
    public index: Sprite
    public item: number
    public state: number
    public cuts: number
    constructor(_item: IngredientTypes, _state: IngredientStates){
        this.item = _item
        this.state = _state
        this.index = sprites.create(ingredientSpriteTable[_item][_state], SpriteKind.Ingredient)
        this.cuts = 0;
    }
    step(){
        if (obj_pepinillo.click != null){
            if (this.index.overlapsWith(obj_pepinillo.click)){
                if (obj_pepinillo.click.kind() == SpriteKind.ClickA){
                    if (tiles.tileAtLocationEquals(obj_pepinillo.click.tilemapLocation(), assets.tile`TSpawner`)) {
                        obj_pepinillo.delIng()
                        let _ingredient = createIngredient(this.item, this.state)
                        _ingredient.setPosition(this.index.x, this.index.y)
                    } else {
                        obj_pepinillo.placeIng()
                    }

                    obj_pepinillo.click.setPosition(-10,-10)
                    obj_pepinillo.holdingIng = this
                }else{
                    if (
                        this.item == IngredientTypes.Dough &&
                        this.state == IngredientStates.Raw &&
                        tiles.tileAtLocationEquals(obj_pepinillo.click.tilemapLocation(), assets.tile`TWorkstation`)
                    ){
                        let _pizza = new Pizza()
                        ingredientsInGame.push(_pizza)
                        _pizza.setPosition(this.index.x, this.index.y)
                        this.destroy()
                        obj_pepinillo.click.setPosition(-10, -10)
                    } else if (this.state == IngredientStates.Raw &&
                        ingredientSpriteTable[this.item][IngredientStates.Chopped] != null &&
                        tiles.tileAtLocationEquals(obj_pepinillo.click.tilemapLocation(), assets.tile`TChoppingBoard`)
                    ){
                        this.cuts++
                        this.setPosition(
                            Math.floor(this.index.x / 16) * 16 + 8 + Math.randomRange(-4, 4),
                            Math.floor(this.index.y / 16) * 16 + 8 + Math.randomRange(-4, 4)
                        )
                        obj_pepinillo.click.setPosition(-10, -10)
                        if(this.cuts >= 5){
                            this.state = IngredientStates.Chopped
                            this.setPosition(
                                Math.floor(this.index.x / 16) * 16 + 8,
                                Math.floor(this.index.y / 16) * 16 + 8
                            )
                            this.updateSprite()
                        }
                    }
                }
            }
        }
    }

    updateSprite(){
        this.index.setImage(ingredientSpriteTable[this.item][this.state])
    }
    destroy(){
        this.index.destroy()
    }
    setPosition(_x: number, _y: number){
        this.index.setPosition(_x, _y);
    }
}

class Pizza extends GameItem{
    ingTypeList: IngredientTypes[]
    constructor(){
        super(IngredientTypes.Dough, IngredientStates.Raw)

        this.ingTypeList = [IngredientTypes.Dough]
        this.index.setImage(assets.image`PzRawDough`)
    }
    step() {
        if (obj_pepinillo.click != null) {
            if (this.index.overlapsWith(obj_pepinillo.click)) {
                if (obj_pepinillo.click.kind() == SpriteKind.ClickA) {
                    if(obj_pepinillo.holdingIng != null){
                        if (
                            obj_pepinillo.holdingIng.item == IngredientTypes.Sauce ||
                            obj_pepinillo.holdingIng.state == IngredientStates.Chopped
                        ){
                            this.ingTypeList.push(obj_pepinillo.holdingIng.item)
                            obj_pepinillo.delIng()
                        }
                    }else{
                        obj_pepinillo.holdingIng = this
                    }
                    obj_pepinillo.click.setPosition(-10, -10)
                    
                } else {
                    
                }
            }
        }
    }
}

let obj_foodSpawners = {
    positions: [
        { x: 3, y: 2 },
        { x: 4, y: 2 },
        { x: 6, y: 2 },
        { x: 7, y: 2 },
        { x: 9, y: 2 },
        { x: 10, y: 2 },
        { x: 12, y: 2 },
        { x: 13, y: 2 }
    ],
    initFood: function () {
        for (let i = 0; i < obj_foodSpawners.positions.length; i++) {
            let _ingredient = createIngredient(i, IngredientStates.Raw)
            _ingredient.setPosition(
                obj_foodSpawners.positions[i].x * 16 + 8,
                obj_foodSpawners.positions[i].y * 16 + 8
            )
        }
    }
}

//Pepinillo Setup

function dirPosMod (direction: number){ //Direction Position mod
    if (direction == 0) return { x: 1, y: 0 }
    if (direction == 1) return { x: 0, y: 1 }
    if (direction == 2) return { x: -1, y: 0 }
    if (direction == 3) return { x: 0, y: -1 }
    return { x: 0, y: 0 }
}

let obj_pepinillo = {
    hitBox: sprites.create(assets.image`pepinilloHB`, SpriteKind.Player),
    sprite: sprites.create(assets.image`PepinilloF`, SpriteKind.Player),
    angle: 0,
    isAnimating: false,
    animAngle: 0,
    holdingIng: null as GameItem, //The var name is not a typo. It's short for "holding ingredient"
    delIng: function (){
        if (obj_pepinillo.holdingIng != null) {
            obj_pepinillo.holdingIng.destroy()
            obj_pepinillo.holdingIng = null as GameItem;
        }
    },
    placeIng: function (){
        if (obj_pepinillo.holdingIng != null) {
            obj_pepinillo.holdingIng.setPosition(obj_pepinillo.click.x, obj_pepinillo.click.y);
            obj_pepinillo.holdingIng = null as GameItem;
        }
    },
    cursor: sprites.create(assets.image`cursor`, SpriteKind.Player),
    click: null as Sprite,
    idleSprites: [
        assets.image`PepinilloR`,
        assets.image`PepinilloF`,
        assets.image`PepinilloL`,
        assets.image`PepinilloB`
    ],
    moveSprites: [
        assets.animation`PepinilloWalkR`,
        assets.animation`PepinilloWalkF`,
        assets.animation`PepinilloWalkL`,
        assets.animation`PepinilloWalkB`
    ],
    changeAngle: function (_moveX: number, _moveY: number){
        if (_moveY < 0) return 3
        if (_moveY > 0) return 1
        if (_moveX < 0) return 2
        if (_moveX > 0) return 0
        return obj_pepinillo.angle
    },
    setSprite: function(_moveSpeed: number){
        if (_moveSpeed != 0){
            if (!obj_pepinillo.isAnimating || (obj_pepinillo.animAngle != obj_pepinillo.angle)){
                animation.runImageAnimation(
                    obj_pepinillo.sprite, obj_pepinillo.moveSprites[obj_pepinillo.angle],
                    125, true
                )
                obj_pepinillo.isAnimating = true
                obj_pepinillo.animAngle = obj_pepinillo.angle
            }
        }else{
            obj_pepinillo.sprite.setImage(obj_pepinillo.idleSprites[obj_pepinillo.angle])
            animation.stopAnimation(animation.AnimationTypes.All, obj_pepinillo.sprite)
            obj_pepinillo.isAnimating = false
        }
        
    },
    step: function (){
        //Pepinillo Move
        let _moveX = controller.dx()
        let _moveY = controller.dy()
        let _moveRaw = 100
        let _moveSpeed = _moveRaw / Math.sqrt(_moveX ** 2 + _moveY ** 2)
        obj_pepinillo.hitBox.setVelocity(Math.floor(_moveX * _moveSpeed), Math.floor(_moveY * _moveSpeed))
        obj_pepinillo.sprite.setPosition(obj_pepinillo.hitBox.x, obj_pepinillo.hitBox.y - 8 )
        
        obj_pepinillo.angle = obj_pepinillo.changeAngle(_moveX, _moveY)
        obj_pepinillo.setSprite(Math.sqrt(_moveX ** 2 + _moveY ** 2))
        
        //Pepinillo Cursor
        obj_pepinillo.cursor.setPosition(
            Math.floor(obj_pepinillo.hitBox.x / 16) * 16 + (dirPosMod(obj_pepinillo.angle).x * 16) + 8,
            Math.floor(obj_pepinillo.hitBox.y / 16) * 16 + (dirPosMod(obj_pepinillo.angle).y * 16) + 8
        )
        //Move holdingFruit
        if (obj_pepinillo.holdingIng != null){
            obj_pepinillo.holdingIng.setPosition(obj_pepinillo.hitBox.x, obj_pepinillo.hitBox.y - 32)
        }
    }
}



obj_foodSpawners.initFood()

scene.cameraFollowSprite(obj_pepinillo.hitBox)
obj_pepinillo.hitBox.setFlag(SpriteFlag.ShowPhysics, true)
obj_pepinillo.sprite.setFlag(SpriteFlag.Ghost, true)
obj_pepinillo.hitBox.setFlag(SpriteFlag.Invisible, true)
obj_pepinillo.sprite.z = 10

//Scene Setup
scene.setTileMapLevel(assets.tilemap`level`);

forever(function() {
    obj_pepinillo.step()
    ingredientsInGame.forEach(obj =>{
        obj.step()
    })
})

controller.A.onEvent(ControllerButtonEvent.Pressed, function() {
    sprites.destroyAllSpritesOfKind(SpriteKind.ClickA)
    obj_pepinillo.click = sprites.create(assets.image`clickCursor`, SpriteKind.ClickA)
    obj_pepinillo.click.lifespan = 100
    //_newCursor.setFlag(SpriteFlag.Invisible, true)
    obj_pepinillo.click.setPosition(obj_pepinillo.cursor.x, obj_pepinillo.cursor.y)
    if(obj_pepinillo.holdingIng != null){
        if (tiles.tileAtLocationEquals(obj_pepinillo.click.tilemapLocation(), assets.tile`TTrashcan`)) {
            obj_pepinillo.delIng()
            obj_pepinillo.click.setPosition(-10, -10)
        } else if (tiles.tileAtLocationEquals(obj_pepinillo.click.tilemapLocation(), assets.tile`TTFloor`)) {
            obj_pepinillo.click.setPosition(-10, -10)
        }
    }
})

controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    sprites.destroyAllSpritesOfKind(SpriteKind.ClickB)
    obj_pepinillo.click = sprites.create(assets.image`clickCursorB`, SpriteKind.ClickB)
    obj_pepinillo.click.lifespan = 100
    //_newCursor.setFlag(SpriteFlag.Invisible, true)
    obj_pepinillo.click.setPosition(obj_pepinillo.cursor.x, obj_pepinillo.cursor.y)
})


sprites.onDestroyed(SpriteKind.ClickA, function(sprite: Sprite) {
    if (
        !(tiles.tileAtLocationEquals(obj_pepinillo.click.tilemapLocation(), assets.tile`TWorkstation`) &&
        obj_pepinillo.holdingIng.item != IngredientTypes.Dough
        ) && sprite.y != -10
    ) {
        obj_pepinillo.placeIng()
    }
    if (sprite.y != -10){
        
    }
})