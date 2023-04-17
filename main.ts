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

const musicArray = [
    music.createSong(assets.song`cheesepizza`),
    music.createSong(assets.song`pepperonipizza`),
    music.createSong(assets.song`sausagepizza`),
    music.createSong(assets.song`spinachpizza`),
    music.createSong(assets.song`everythingpizza`),
]

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
        ingredientsInGame.push(this)
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
                    music.play(music.createSoundEffect(WaveShape.Sine, 591, 1126, 255, 0, 200, SoundExpressionEffect.None, InterpolationCurve.Curve), music.PlaybackMode.InBackground)

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
                        music.play(music.createSoundEffect(WaveShape.Triangle, 200, 600, 255, 0, 150, SoundExpressionEffect.None, InterpolationCurve.Curve), music.PlaybackMode.InBackground)
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
                        
                        music.play(music.createSoundEffect(WaveShape.Noise, 457, 1, 255, 0, 100, SoundExpressionEffect.Warble, InterpolationCurve.Logarithmic), music.PlaybackMode.InBackground)
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

        if(obj_pepinillo.holdingIng != this){
            this.index.z = this.index.y
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
    cookTime: number
    finished: boolean
    constructor(){
        super(IngredientTypes.Dough, IngredientStates.Raw)

        this.cookTime = 0
        this.finished = false
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
                            this.index.setImage(this.addToImage(this.index.image.clone(), obj_pepinillo.holdingIng.item, IngredientStates.OnPizza))
                            obj_pepinillo.delIng()
                            music.play(music.createSoundEffect(WaveShape.Triangle, 200 + (100 * this.ingTypeList.length - 2), 600 + (100 * this.ingTypeList.length - 2), 255, 0, 150, SoundExpressionEffect.None, InterpolationCurve.Curve), music.PlaybackMode.InBackground)
                        }
                    }else{
                        obj_pepinillo.holdingIng = this
                        music.play(music.createSoundEffect(WaveShape.Sine, 591, 1126, 255, 0, 200, SoundExpressionEffect.None, InterpolationCurve.Curve), music.PlaybackMode.InBackground)
                    }

                    obj_pepinillo.click.setPosition(-10, -10)
                    
                } else {
                    
                }
            }
        }
        if (tiles.tileAtLocationEquals(this.index.tilemapLocation(), assets.tile`TStove`)){
            this.cookTime++;
            if (this.cookTime >= (3600 - (difficulty * 450)) && difficulty != 0){
                this.index.setImage(assets.image`BurntPizza`)
            } else if (this.cookTime >= 1200) {
                this.index.setImage(this.createCookedImage())
            }
        }
    }
    createCookedImage(){
        let _cookedImage = image.create(16, 16)

        this.ingTypeList.forEach( _ing =>{
            let _sprState
            if (ingredientSpriteTable[_ing][IngredientStates.Cooked] != null){
                _sprState = IngredientStates.Cooked
            }else{
                _sprState = IngredientStates.OnPizza
            }
            _cookedImage = this.addToImage(_cookedImage.clone(), _ing, _sprState)
        })
        return _cookedImage

    }
    addToImage(_image: Image, _item: IngredientTypes, _state: IngredientStates){
        let _thisImage = _image.clone()
        let _addTo = ingredientSpriteTable[_item][_state].clone()
        
        for (let i = 0; i < _thisImage.width; i++){
            for (let j = 0; j < _thisImage.height; j++) {
                let _pixel = _addTo.getPixel(i, j)
                if (_pixel != 0){
                    _thisImage.setPixel(i, j, _pixel)
                }
            }
        }

        return _thisImage
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
            music.play(music.createSoundEffect(WaveShape.Sine, 1126, 591, 255, 0, 200, SoundExpressionEffect.None, InterpolationCurve.Curve), music.PlaybackMode.InBackground)
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
        
        obj_pepinillo.sprite.z = obj_pepinillo.hitBox.y
        
        //Pepinillo Cursor
        obj_pepinillo.cursor.setPosition(
            Math.floor(obj_pepinillo.hitBox.x / 16) * 16 + (dirPosMod(obj_pepinillo.angle).x * 16) + 8,
            Math.floor(obj_pepinillo.hitBox.y / 16) * 16 + (dirPosMod(obj_pepinillo.angle).y * 16) + 8
        )
        //Move holdingFruit
        if (obj_pepinillo.holdingIng != null){
            obj_pepinillo.holdingIng.setPosition(obj_pepinillo.hitBox.x, obj_pepinillo.hitBox.y - 32)
            obj_pepinillo.holdingIng.index.z = obj_pepinillo.hitBox.y
        }
    }
}

obj_foodSpawners.initFood()

scene.cameraFollowSprite(obj_pepinillo.hitBox)
obj_pepinillo.hitBox.setFlag(SpriteFlag.ShowPhysics, true)
obj_pepinillo.sprite.setFlag(SpriteFlag.Ghost, true)
obj_pepinillo.hitBox.setFlag(SpriteFlag.Invisible, true)
obj_pepinillo.sprite.z = 10

//Customer Setup


const customerList = [
    assets.image`customer_0`,
    assets.image`customer_1`,
    assets.image`customer_2`,
    assets.image`customer_3`,
    assets.image`customer_4`,
    assets.image`customer_5`,
    assets.image`customer_6`,
    assets.image`customer_7`,
]

let activeCustomers = [] as Customer[]

const pizzaRanksImg = [
    assets.image`DRank`,
    assets.image`CRank`,
    assets.image`BRank`,
    assets.image`ARank`,
    assets.image`SRank`
]

const rankSounds = [
    music.createSong(assets.song`dRanked`),
    music.createSong(assets.song`cRanked`),
    music.createSong(assets.song`bRanked`),
    music.createSong(assets.song`aRanked`),
    music.createSong(assets.song`sRanked`),
]


class Customer{
    index: Sprite
    order: IngredientTypes[]
    orderSpr: Sprite
    numInLine: number
    waitTime: number

    constructor(){
        this.waitTime = -500
        this.index = sprites.create(customerList[Math.randomRange(0, customerList.length - 1)], SpriteKind.Player)
        this.index.setPosition(16 * 16, 16 * 11)
        this.index.setFlag(SpriteFlag.Ghost, true)
        this.index.setVelocity(-20, 0)
        this.order = this.createOrder(currentLevel - 1)
        this.orderSpr = sprites.create(assets.image`orderBubble`, SpriteKind.Player)
        animation.runImageAnimation(this.orderSpr, this.animateOrder(), 3000/this.order.length, true)
        activeCustomers.push(this)
        this.numInLine = activeCustomers.length
    }

    createOrder(_complexity: number){
        let _order = [] as IngredientTypes[]
        _order.push(IngredientTypes.Dough)
        switch (_complexity){
            case 0:
                _order.push(IngredientTypes.Sauce)
                _order.push(IngredientTypes.Cheese)
                break;
            case 1:
                _order.push(IngredientTypes.Sauce)
                _order.push(IngredientTypes.Cheese)
                if (Math.random() >= 0.5) _order.push(IngredientTypes.Pepperoni)
                break;
            case 2:
                _order.push(IngredientTypes.Sauce)
                _order.push(IngredientTypes.Cheese)
                if (Math.random() >= 0.75) _order.push(IngredientTypes.Pepperoni)
                if (Math.random() >= 0.5) _order.push(IngredientTypes.Sausage)
                break;
            case 3:
                _order.push(IngredientTypes.Sauce)
                _order.push(IngredientTypes.Cheese)
                if (Math.random() >= 0.90) _order.push(IngredientTypes.Pepperoni)
                if (Math.random() >= 0.75) _order.push(IngredientTypes.Sausage)
                if (Math.random() >= 0.5) _order.push(IngredientTypes.Spinach)
                if (Math.random() >= 0.5) _order.push(IngredientTypes.Olives)
                break;
            default:
                let _topping
                for (let i = 0; i < 5; i++) {
                    do {
                        _topping = Math.randomRange(1,7)
                    } while (_topping == _order[_order.length - 1])
                    _order.push(_topping)
                }
                break;
        }
        
        return _order
    }

    step(){
        this.waitTime++;
        this.index.z = this.index.y
        this.orderSpr.z = this.index.y
        this.orderSpr.setPosition(this.index.x, this.index.y - 32)
        if (this.index.x <= this.numInLine * 32 + 8){
            this.index.setVelocity(0,0)
            this.index.setPosition(this.numInLine * 32 + 8, this.index.y)
        }else{
            this.index.setVelocity(-20, 0)
        }
    }

    addToImage(_image: Image, _topImage: Image) {
        let _thisImage = _image.clone()
        let _addTo = _topImage

        for (let i = 0; i < _thisImage.width; i++) {
            for (let j = 0; j < _thisImage.height; j++) {
                let _pixel = _addTo.getPixel(i, j)
                if (_pixel != 0) {
                    _thisImage.setPixel(i + 2, j + 2, _pixel)
                }
            }
        }

        return _thisImage
    }
    animateOrder(){
        let _animatedOrder = [] as Image[]
        
        _animatedOrder.push(this.addToImage(assets.image`orderBubble`, assets.image`newOrder`))

        this.order.forEach(item =>{
            _animatedOrder.push(this.addToImage(assets.image`orderBubble`, ingredientSpriteTable[item][IngredientStates.Raw]))
        })
        return _animatedOrder
        
    }

    rankPizza(_pizza: Pizza){
        let _pizzaRank     

        if (_pizza.cookTime < 1200 || (_pizza.cookTime >= (3600 - (difficulty * 450)) && difficulty != 0)){
            _pizzaRank = 0
        } else {
            _pizzaRank = 3
            for (let i = 0; i < Math.max(_pizza.ingTypeList.length, this.order.length); i++){
                if (this.order[i] != _pizza.ingTypeList[i]){
                    Math.max(0, _pizzaRank--)
                }
            }
            if ((_pizzaRank == 3) && (this.waitTime < 2400)){
                _pizzaRank = 4;
            }
        }
        _pizzaRank = Math.max(0, Math.min(_pizzaRank, 4))
        music.setVolume(50)
        music.play(rankSounds[_pizzaRank], music.PlaybackMode.InBackground)
        music.setVolume(255)
        info.changeScoreBy((_pizzaRank * 0.25) * (this.order.length - 1) * 5)

        activeCustomers.splice(0,1)
        activeCustomers.forEach(obj => {
            obj.numInLine--;
        })
        this.orderSpr.setFlag(SpriteFlag.AutoDestroy, true)
        this.orderSpr.setFlag(SpriteFlag.Ghost, true)
        this.index.setFlag(SpriteFlag.AutoDestroy, true)
        this.orderSpr.setVelocity(-20, 0)
        this.index.setVelocity(-20, 0)
        this.orderSpr.setImage(this.addToImage(assets.image`orderBubble`, pizzaRanksImg[_pizzaRank]))
    }
}

//Scene Setup
scene.setTileMapLevel(assets.tilemap`level`);

game.setGameOverPlayable(false, music.createSong(assets.song`gameOver`), false)
game.setGameOverMessage(false, "MAMMA MIA!")
game.setGameOverEffect(false, effects.splatter)

info.onCountdownEnd(function() {
    music.stopAllSounds()
    info.setScore(currentLevel - 1)
    game.over()
})

game.onUpdateInterval(15000, function () {
    new Customer
})



obj_pepinillo.hitBox.setPosition(40, 152)
pause(1)
game.splash("Extra Baked")
game.showLongText("A to pickup/place down. B to interact. Make the requested pizza for each customer. Make the required money amount for the day before time runs out in order to move to the next day. You lose when the time runs out.", DialogLayout.Full)


///Level Setup
game.showLongText("Choose a difficulty: \n1 - Little Linguini \n2 - Marinara Enthusiast \n3 - Spicy Meatball \n4 - MAMMA MIA!! \n5 - Dante Alighieri", DialogLayout.Full)
let difficulty = Math.max(Math.min(game.askForNumber("Enter your difficulty", 1), 5) - 1, 0)
let moneyRequirement = 0
let currentLevel = 1 + difficulty
function setUpLevel(_levelNum: number){

    obj_pepinillo.hitBox.setPosition(40, 152)
    info.setScore(0)
    moneyRequirement = 10 + ((5 + (5 * difficulty)) * _levelNum)
    let _time = 60 + (Math.floor(moneyRequirement / 10) * (60 / (difficulty + 1)))
    let _timeText
    if (_time % 60 == 0){
        _timeText = _time/60 + " minutes"
    } else {
        _timeText = Math.floor(_time / 60) + " minute(s) and " + (_time % 60) + " seconds"
    }

    activeCustomers.forEach(cust =>{
        cust.index.destroy()
        cust.orderSpr.destroy()
    })
    activeCustomers = []
    new Customer

    music.stopAllSounds()
    if (_levelNum >= musicArray.length - 1){
        music.play(music.createSong(assets.song`levelUpHard`), music.PlaybackMode.InBackground)
    } else {
        music.play(music.createSong(assets.song`levelUp`), music.PlaybackMode.InBackground)
    } 
    game.splash("Level " + _levelNum + " - Make $" + moneyRequirement + " in " + _timeText)
    info.startCountdown(_time)
    music.setVolume(50)
    music.play(musicArray[Math.min(_levelNum - 1, musicArray.length - 1)], music.PlaybackMode.LoopingInBackground)
    music.setVolume(255)
}

setUpLevel(currentLevel)


forever(function() {
    obj_pepinillo.step()
    ingredientsInGame.forEach(obj =>{
        obj.step()
    })
    activeCustomers.forEach(obj => {
        obj.step()
    })

    if(info.score() >= moneyRequirement){
        currentLevel++
        setUpLevel(currentLevel)
    }
})

controller.A.onEvent(ControllerButtonEvent.Pressed, function() {
    sprites.destroyAllSpritesOfKind(SpriteKind.ClickA)
    obj_pepinillo.click = sprites.create(assets.image`clickCursor`, SpriteKind.ClickA)
    obj_pepinillo.click.lifespan = 100
    obj_pepinillo.click.setFlag(SpriteFlag.Invisible, true)
    obj_pepinillo.click.setPosition(obj_pepinillo.cursor.x, obj_pepinillo.cursor.y)
    if(obj_pepinillo.holdingIng != null){
        if (tiles.tileAtLocationEquals(obj_pepinillo.click.tilemapLocation(), assets.tile`TTrashcan`)) {
            music.play(music.createSoundEffect(WaveShape.Noise, 1571, 279, 255, 0, 150, SoundExpressionEffect.None, InterpolationCurve.Curve), music.PlaybackMode.InBackground)
            obj_pepinillo.delIng()
            obj_pepinillo.click.setPosition(-10, -10)
        } else if (tiles.tileAtLocationEquals(obj_pepinillo.click.tilemapLocation(), assets.tile`TTFloor`)) {
            obj_pepinillo.click.setPosition(-10, -10)
        } else if (tiles.tileAtLocationEquals(obj_pepinillo.click.tilemapLocation(), assets.tile`TBoxingStation`)){
            if (obj_pepinillo.holdingIng instanceof Pizza){
                obj_pepinillo.holdingIng.index.setImage(assets.image`PzBox`)
                obj_pepinillo.holdingIng.finished = true
                music.play(music.createSoundEffect(WaveShape.Noise, 1, 546, 170, 237, 100, SoundExpressionEffect.None, InterpolationCurve.Logarithmic), music.PlaybackMode.InBackground)
            }
            obj_pepinillo.click.setPosition(-10, -10)
        } else if (tiles.tileAtLocationEquals(obj_pepinillo.click.tilemapLocation(), assets.tile`TStove`)){
            if (!(obj_pepinillo.holdingIng instanceof Pizza && obj_pepinillo.holdingIng.cookTime < 1200 && obj_pepinillo.holdingIng.finished == false)){
                obj_pepinillo.click.setPosition(-10, -10)
            }
        }
    }
})

controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    sprites.destroyAllSpritesOfKind(SpriteKind.ClickB)
    obj_pepinillo.click = sprites.create(assets.image`clickCursorB`, SpriteKind.ClickB)
    obj_pepinillo.click.lifespan = 100
    obj_pepinillo.click.setFlag(SpriteFlag.Invisible, true)
    obj_pepinillo.click.setPosition(obj_pepinillo.cursor.x, obj_pepinillo.cursor.y)
})

sprites.onDestroyed(SpriteKind.ClickA, function (sprite: Sprite) {
    if (obj_pepinillo.holdingIng != null && sprite.y != -10) {
        if (tiles.tileAtLocationEquals(obj_pepinillo.click.tilemapLocation(), assets.tile`TWorkstation`)) {
            if ((obj_pepinillo.holdingIng instanceof Pizza && obj_pepinillo.holdingIng.cookTime < 1200 && obj_pepinillo.holdingIng.finished == false) || (!(obj_pepinillo.holdingIng instanceof Pizza) && obj_pepinillo.holdingIng.item == IngredientTypes.Dough)) {
                obj_pepinillo.placeIng()
                music.play(music.createSoundEffect(WaveShape.Sine, 1126, 591, 255, 0, 200, SoundExpressionEffect.None, InterpolationCurve.Curve), music.PlaybackMode.InBackground)

            }
        } else if (tiles.tileAtLocationEquals(obj_pepinillo.click.tilemapLocation(), assets.tile`TRegister`)){
            if (obj_pepinillo.holdingIng instanceof Pizza && obj_pepinillo.holdingIng.finished == true){
                let _pCust = activeCustomers[0]
                animation.stopAnimation(animation.AnimationTypes.All, _pCust.orderSpr)
                _pCust.rankPizza(obj_pepinillo.holdingIng)
                obj_pepinillo.holdingIng.destroy()
                obj_pepinillo.holdingIng = null
            }
        } else {
            obj_pepinillo.placeIng()
        }
    }
})
