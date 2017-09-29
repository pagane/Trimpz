/*global game,tooltip,resolvePow,getNextPrestigeCost,adjustMap,updateMapCost,addSpecials,enteringValue*/
/*jslint plusplus: true */

//sets of constants to modify that will be switched out over the course of the game
//generally speaking, and by default, it starts with constantsEarlyGame and then uses the next set at 45,55, and then 60
//if you add an entirely new constant set, be sure to add it in order in the array "constantsSets" and set the set's "zoneToStartAt" appropriately
function ConstantSet(overrides){
    "use strict";
    if (overrides) {
        ChangeValues(this, overrides);
    }
}
function ChangeValues(theObject, values){
    "use strict";
    for (var x in values) {
        theObject[x] = values[x];
    }
}
ConstantSet.prototype = {
    zoneToStartAt : 0,                  //where this set of constants begins being used
    runInterval : 200,                  //how often Trimpz main loop is run
    minerMultiplier : 2,                //how many more miners than farmers? (multiplied)
    lumberjackMultiplier : 1,           //how many more lumberjacks than farmers? (multiplied)
    trainerCostRatio : 0.4,             //buy trainers with enough resources (0.2 = 20% of resources)
    explorerCostRatio : 0.2,            //buy explorers with enough resources (0.2 = 20% of resources)
    magmamancerCostRatio : 0.01,        //buy magmamancers with enough resources (0.2 = 20% of resources)
    minFoodOwned : 15,                  //minimum food on hand, required for beginning of the game
    minWoodOwned : 15,                  //minimum wood on hand, required for beginning of the game
    minTrimpsOwned : 9,                 //minimum trimps on hand, required for beginning of the game
    minScienceOwned : 10,               //minimum science on hand, required for beginning of the game
    housingCostRatio : 0.3,             //buy housing with enough resources (0.2 = 20% of resources)
    gymCostRatio : 0.6,                 //buy gyms with enough resources (0.2 = 20% of resources)
    maxGyms : 10000,                    //maximum number of gyms to buy
    tributeCostRatio : 0.5,             //buy tributes with enough resources (0.2 = 20% of resources)
    nurseryCostRatio : 0.5,             //buy nursery with enough resources (0.2 = 20% of resources)
    maxLevel : 10,                      //maximum level of all equipment per tier unless it's really cheap(see constant above)
    equipmentCostRatio : 0.5,           //buy equipment with enough resources (0.2 = 20% of resources)
    otherWorkersFocusRatio : 0.5,       //what percent of trimps to take from each other job to focus on gaining resources for an upgrade, including science
    numTrapsForAutoTrapping : 10000,    //maximum number of traps to build
    shieldCostRatio : 1,                //buy shield with enough resources (1 = 100% of resources)
    shouldSkipHpEquipment : false,      //true to not buy or prestige/upgrade health equipment
    getZoneToStartAt: function () { return this.zoneToStartAt; },
    getRunInterval: function () { return this.runInterval; },
    getTrainerCostRatio: function () { return this.trainerCostRatio; },
    getMinerMultiplier: function () { return this.minerMultiplier; },
    getExplorerCostRatio: function () { return this.explorerCostRatio; },
    getMagmamancerCostRatio: function () { return this.magmamancerCostRatio; },
    getMinFoodOwned: function () { return this.minFoodOwned; },
    getMinWoodOwned: function () { return this.minWoodOwned; },
    getMinTrimpsOwned: function () { return this.minTrimpsOwned; },
    getMinScienceOwned: function () { return this.minScienceOwned; },
    getGymCostRatio: function () { return this.gymCostRatio; },
    getMaxGyms : function () { return this.maxGyms; },
    getHousingCostRatio: function () { return this.housingCostRatio; },
    getTributeCostRatio: function () { return this.tributeCostRatio; },
    getNurseryCostRatio: function () { return this.nurseryCostRatio; },
    getMaxLevel: function () {return this.maxLevel;},
    getEquipmentCostRatio: function () {return this.equipmentCostRatio;},
    getOtherWorkersFocusRatio: function () {return this.otherWorkersFocusRatio;},
    getNumTrapsForAutoTrapping: function () {return this.numTrapsForAutoTrapping;},
    getShieldCostRatio: function () {return this.shieldCostRatio;},
    getLumberjackMultiplier: function () {return this.lumberjackMultiplier;},
    getShouldSkipHpEquipment: function () {return this.shouldSkipHpEquipment;}
};

var constantsEarlyGame = new ConstantSet();
var constantsLateGame = new ConstantSet({
    zoneToStartAt : 45,
    minerMultiplier : 0.5,
    lumberjackMultiplier : 0.5,
    housingCostRatio : 0.1,
    gymCostRatio : 0.95,
    tributeCostRatio : 0.8,
    nurseryCostRatio : 0,
    maxLevel : 5,
    equipmentCostRatio : 0.8
});
var constantsLateLateGame = new ConstantSet({
    zoneToStartAt : 55,
    minerMultiplier : 1,
    lumberjackMultiplier : 0.5,
    explorerCostRatio : 0.01,
    housingCostRatio : 0.5,
    gymCostRatio : 0.8,
    tributeCostRatio : 0.9,
    nurseryCostRatio : 0,
    maxLevel : 4,
    equipmentCostRatio : 0.9,
    getZoneToStartAt:
        function () { //don't start until enough block since last constants should be getting gyms
            if (game.global.soldierCurrentBlock > 750 * 1000000000000000) { //need about 750Qa to beat 59 boss
                return this.zoneToStartAt; //enough block, begin!
            }
            return constantsEndGame.getZoneToStartAt(); //not enough block, but need to start next constants if too late
        }
});
var constantsEndGame = new ConstantSet({
    zoneToStartAt : 60,
    minerMultiplier : 4,
    lumberjackMultiplier : 0.33,
    explorerCostRatio: 0,
    housingCostRatio : 0,
    gymCostRatio : 0.5,
    tributeCostRatio : 0.7,
    nurseryCostRatio : 0,
    maxLevel : 4,
    equipmentCostRatio : 0.9
});
var constantsCorruption = new ConstantSet({
    zoneToStartAt : 180,
    minerMultiplier : 1000,
    lumberjackMultiplier : 2,
    explorerCostRatio: 0,
    housingCostRatio : 0,
    gymCostRatio : 0.2,
    tributeCostRatio : 0.7,
    nurseryCostRatio : 0,
    maxLevel : 4,
    equipmentCostRatio : 0.999
});

var constantsMagma = new ConstantSet({
    zoneToStartAt : 230,
    minerMultiplier : 1000,
    lumberjackMultiplier : 2,
    explorerCostRatio: 0,
    housingCostRatio : 0,
    gymCostRatio : 0.2,
    tributeCostRatio : 0.7,
    nurseryCostRatio : 0.5,
    maxLevel : 14,
    equipmentCostRatio : 0.999
});

//game variables, not for user setting
const DominanceIndex = 2;
const ScryerIndex = 4;
var constantsSets = [constantsEarlyGame, constantsLateGame, constantsLateLateGame, constantsEndGame, constantsCorruption, constantsMagma];
var constantsIndex;
var constants;
var trimpz = 0;             //"Trimpz" running indicator
var workersFocused = false;
var workersFocusedOn;
var workersMoved = [];
var mapsWithDesiredUniqueDrops = [8,10,14,15,18,23,25,29,30,34,40,47,50,80,125]; //removed from array when done, reset on portal or refresh
var uniqueMaps = ["The Block", "The Wall",  "Dimension of Anger", "Trimple Of Doom", "The Prison"];
var helium = -1;
var heliumHistory = [];
var pauseTrimpz = false;
var bionicDone = false;
var heliumLog = [];
var trimpzSettings = {};
var mapRunStatus = "";
var shouldPortal = false;
var portalAtWorld = 0;
var unusedCoordsAt = 0;
var warpsAtLastGiga = 0;
var beginPortalTime;
var firstVoidMap = 0;
var firstOverkillFail = 0;
var prestiges = ["Dagadder", "Bootboost", "Megamace", "Hellishmet", "Polierarm", "Pantastic", "Axeidic", "Smoldershoulder", "Greatersword", "Bestplate", "Harmbalest", "GambesOP"];

//Loads the automation settings from browser cache
function loadPageVariables() {
    "use strict";
    var tmp = JSON.parse(localStorage.getItem('TrimpzSettings'));
    if (tmp !== null) {
        trimpzSettings = tmp;
    }
}

//Saves automation settings to browser cache
function saveSettings() {
    "use strict";
    localStorage.setItem('TrimpzSettings', JSON.stringify(trimpzSettings));
}

function initializeUiAndSettings() {
    "use strict";
    loadPageVariables();
    document.head.appendChild(document.createElement('script')).src = 'https://rawgit.com/pagane/Trimpz/highhe/NewUI.js';
}

function setMapRunStatus(status){
    "use strict";
    mapRunStatus = status;
    var element = document.getElementById("pauseTrimpzBtn");
    if (element){
        if (pauseTrimpz === true){
            element.innerHTML = "Paused " + status;
        } else{
            element.innerHTML = "Running " + status;
        }
    }
}

/**
 * @return {boolean} return.canAfford affordable respecting the ratio?
 */
function CanBuyNonUpgrade(nonUpgradeItem, ratio) {
    "use strict";
    var aResource; //JSLint insisted I move declaration to top...
    var needed;
    if (typeof nonUpgradeItem == 'undefined') return false;
    for (aResource in nonUpgradeItem.cost) {
        needed = nonUpgradeItem.cost[aResource];
        if (typeof needed[1] != 'undefined') {
            needed = resolvePow(needed, nonUpgradeItem);
        }
        if (typeof nonUpgradeItem.prestige != 'undefined') {//Discount equipment
            needed = Math.ceil(needed * (Math.pow(1 - game.portal.Artisanistry.modifier, game.portal.Artisanistry.level)));
        } else if (game.portal.Resourceful.level)
        {
            needed = Math.ceil(needed * (Math.pow(1 - game.portal.Resourceful.modifier, game.portal.Resourceful.level)));
        }
        if (game.resources[aResource].owned * ratio < needed) {
            return false;
        }
    }
    return true;
}

function GetNonUpgradePrice(nonUpgradeItem, resource) {
    "use strict";
    var aResource;
    var needed;
    for (aResource in nonUpgradeItem.cost) {
        needed = nonUpgradeItem.cost[aResource];
        if (typeof needed[1] != 'undefined') {
            needed = resolvePow(needed, nonUpgradeItem);
        }
        if (typeof nonUpgradeItem.prestige != 'undefined') {//Discount equipment
            needed = Math.ceil(needed * (Math.pow(1 - game.portal.Artisanistry.modifier, game.portal.Artisanistry.level)));
        } else if (game.portal.Resourceful.level)
        {
            needed = Math.ceil(needed * (Math.pow(1 - game.portal.Resourceful.modifier, game.portal.Resourceful.level)));
        }

        if (resource && aResource === resource)
        {
            return needed;
        }
    }
    return needed;
}

/**
 * @return {number}
 */
function CanBuyWorkerWithResource(job, ratio, food, extraWorkers){
    "use strict";
    var cost = job.cost.food;
    if (job === game.jobs.Magmamancer) cost = job.cost.gems;
    var price = 0;
    if (typeof cost[1] != 'undefined')
        price =  Math.floor((cost[0] * Math.pow(cost[1], job.owned + extraWorkers)) * ((Math.pow(cost[1], 1) - 1) / (cost[1] - 1)));
    else
        price = cost;
    if ( food * ratio >= price)
        return price;
    else{
        return -1;
    }
}

function getTotalTimeForBreeding(almostOwnedGeneticists) {
    "use strict";
    var trimps = game.resources.trimps;
    var trimpsMax = trimps.realMax();
    var potencyMod = trimps.potency;

    //Broken Planet
    if (game.global.brokenPlanet) potencyMod /= 10;
    //Pheromones
    potencyMod *= 1+ (game.portal.Pheromones.level * game.portal.Pheromones.modifier);
    //Geneticist
    if (game.jobs.Geneticist.owned + almostOwnedGeneticists > 0) potencyMod *= Math.pow(.98, game.jobs.Geneticist.owned + almostOwnedGeneticists);
    //Quick Trimps
    if (game.unlocks.quickTrimps) potencyMod *= 2;
    if (game.global.challengeActive == "Daily"){
		if (typeof game.global.dailyChallenge.dysfunctional !== 'undefined'){
			potencyMod *= dailyModifiers.dysfunctional.getMult(game.global.dailyChallenge.dysfunctional.strength);
		}
		if (typeof game.global.dailyChallenge.toxic !== 'undefined'){
			potencyMod *= dailyModifiers.toxic.getMult(game.global.dailyChallenge.toxic.strength, game.global.dailyChallenge.toxic.stacks);
		}
	}
	if (game.global.challengeActive == "Toxicity" && game.challenges.Toxicity.stacks > 0){
        potencyMod *= Math.pow(game.challenges.Toxicity.stackMult, game.challenges.Toxicity.stacks);
    }
    if (game.global.voidBuff == "slowBreed"){
        potencyMod *= 0.2;
    }
    potencyMod = calcHeirloomBonus("Shield", "breedSpeed", potencyMod);
    potencyMod = (1 + (potencyMod / 10));
    var adjustedMax = (game.portal.Coordinated.level) ? game.portal.Coordinated.currentSend : trimps.maxSoldiers;
    var totalTime;
    if (game.options.menu.showFullBreed.enabled == 1) totalTime = log10((trimpsMax - trimps.employed) / (trimpsMax - adjustedMax - trimps.employed)) / log10(potencyMod);
    else {
        var threshold = Math.ceil((trimpsMax - trimps.employed) * 0.95);
        totalTime = log10(threshold / (threshold - adjustedMax)) / log10(potencyMod);
    }
    totalTime /= 10;
    return totalTime;
}

function getRemainingTimeForBreeding() {
    "use strict";
    var trimps = game.resources.trimps;
    var breeding = trimps.owned - trimps.employed;
	var trimpsMax = trimps.realMax();
	
    var potencyMod = trimps.potency;
	//Add potency (book)
	if (game.upgrades.Potency.done > 0) potencyMod *= Math.pow(1.1, game.upgrades.Potency.done);
	//Add Nurseries
	if (game.buildings.Nursery.owned > 0) potencyMod *= Math.pow(1.01, game.buildings.Nursery.owned);
	//Add Venimp
	if (game.unlocks.impCount.Venimp > 0) potencyMod *= Math.pow(1.003, game.unlocks.impCount.Venimp);
	//Broken Planet
	if (game.global.brokenPlanet) potencyMod /= 10;
	//Pheromones
	potencyMod *= 1+ (game.portal.Pheromones.level * game.portal.Pheromones.modifier);
	//Geneticist
	if (game.jobs.Geneticist.owned > 0) potencyMod *= Math.pow(.98, game.jobs.Geneticist.owned);
	//Quick Trimps
	if (game.unlocks.quickTrimps) potencyMod *= 2;
	if (game.global.challengeActive == "Daily"){
		if (typeof game.global.dailyChallenge.dysfunctional !== 'undefined'){
			potencyMod *= dailyModifiers.dysfunctional.getMult(game.global.dailyChallenge.dysfunctional.strength);
		}
		if (typeof game.global.dailyChallenge.toxic !== 'undefined'){
			potencyMod *= dailyModifiers.toxic.getMult(game.global.dailyChallenge.toxic.strength, game.global.dailyChallenge.toxic.stacks);
		}
	}
	if (game.global.challengeActive == "Toxicity" && game.challenges.Toxicity.stacks > 0){
		potencyMod *= Math.pow(game.challenges.Toxicity.stackMult, game.challenges.Toxicity.stacks);
	}
	if (game.global.voidBuff == "slowBreed"){
		potencyMod *= 0.2;
	}
	potencyMod = calcHeirloomBonus("Shield", "breedSpeed", potencyMod);
	breeding = breeding * potencyMod;
	potencyMod = (1 + (potencyMod / 10));
	var timeRemaining = log10((trimpsMax - trimps.employed) / (trimps.owned - trimps.employed)) / log10(potencyMod);
	timeRemaining /= 10;
    return timeRemaining;
}

/*function ShouldBuyGeneticist(food, extraGeneticists) {
    "use strict";
    var trimps = game.resources.trimps;
    var cost;
    var targetBreedTime = trimpzSettings["targetBreedTime"].value;

    var shouldBuy = game.jobs.Geneticist.locked === 0 &&
        game.global.challengeActive !== "Electricity" &&
        (cost = CanBuyWorkerWithResource(game.jobs.Geneticist, 1, food, extraGeneticists)) !== -1 &&
        getTotalTimeForBreeding(extraGeneticists) < targetBreedTime &&
        getRemainingTimeForBreeding() < targetBreedTime &&
        (game.global.lastBreedTime / 1000 < targetBreedTime - getRemainingTimeForBreeding() + trimpzSettings["targetBreedTimeHysteresis"].value ||
        trimps.owned === trimps.realMax());
    return {
        shouldBuy : shouldBuy,
        cost : cost
    };
}*/

function AssignFreeWorkers() {
    "use strict";
    var trimps = game.resources.trimps;
    var food = game.resources.food.owned;
    var gems = game.resources.gems.owned;
    var buy = {
        "Geneticist" : 0,
        "Trainer" : 0,
        "Explorer" : 0,
        "Scientist" : 0,
        "Magmamancer" : 0,
        "Miner" : 0,
        "Lumberjack" : 0,
        "Farmer" : 0
    };
    if (game.global.world < 5 && game.jobs.Scientist.locked === 0 && game.jobs.Scientist.owned<1000)
    {
        game.global.buyAmt = 1000;
        buyJob("Scientist", null, true);
        game.global.buyAmt = 1;
    }

    if (game.global.world < 250 && getRemainingTimeForBreeding()>6) return;
    if (trimps.owned === 0 || game.global.firing) {
        return;
    }

    var free = (Math.ceil(trimps.realMax() / 2) - trimps.employed);

    //make room for a Geneticist
/*    if (free === 0 && ShouldBuyGeneticist(food,0).shouldBuy){
        game.global.firing = true;
        game.global.buyAmt = 20;
        buyJob("Farmer", null, true);
        game.global.firing = false;
        game.global.buyAmt = 1;
    }*/

    if (free <= 0) return;
    var breedCount = (trimps.owned - trimps.employed > 2) ? Math.floor(trimps.owned - trimps.employed) : 0;
    if (free > trimps.owned){
        free = Math.floor(trimps.owned / 3);
    }
    if (game.global.world > 10 && !game.global.mapsActive && game.resources.trimps.soldiers === 0) {
//    if (game.global.world > 10 && !game.global.mapsActive && (game.resources.trimps.soldiers === 0 || getRemainingTimeForBreeding() > trimpzSettings["targetBreedTime"].value)) {
        return;
    }
    var cost;
    var maxFreeForAssignOneAtATime = 1000;
    var totalMultipliers;
    var assignThisMany;
    while (free > 0) {
        if (game.jobs.Miner.locked !== 0)
        {
            buy.Farmer += free;
            break;
        }
        if (free > maxFreeForAssignOneAtATime && game.jobs.Miner.locked === 0){
            totalMultipliers = constants.getMinerMultiplier() + constants.getLumberjackMultiplier() + 1; //1 for default/reference farmer
            assignThisMany = constants.getMinerMultiplier() / totalMultipliers * (free - maxFreeForAssignOneAtATime);
            buy.Miner += Math.floor(assignThisMany);
            assignThisMany = constants.getLumberjackMultiplier() / totalMultipliers * (free - maxFreeForAssignOneAtATime);
            buy.Lumberjack += Math.floor(assignThisMany);
            assignThisMany = free - maxFreeForAssignOneAtATime - buy.Miner - buy.Lumberjack;
            buy.Farmer += assignThisMany;

            free -= buy.Miner + buy.Lumberjack + buy.Farmer;
        }
/*        var geneticistValues = ShouldBuyGeneticist(food, buy.Geneticist);
        if (geneticistValues.shouldBuy){
            food -= geneticistValues.cost;
            buy.Geneticist += 1;
            free--;
        } else */if (game.jobs.Trainer.locked === 0 &&
            (cost = CanBuyWorkerWithResource(game.jobs.Trainer, constants.getTrainerCostRatio(), food , buy.Trainer)) !== -1){
            food -= cost;
            buy.Trainer += 1;
            free--;
        } else if (game.jobs.Explorer.locked === 0 &&
            (cost = CanBuyWorkerWithResource(game.jobs.Explorer, constants.getExplorerCostRatio(), food, buy.Explorer)) !== -1){
            food -= cost;
            buy.Explorer += 1;
            free--;
        } else if (game.jobs.Scientist.locked === 0 && game.jobs.Scientist.owned + buy.Scientist < game.global.world + 1 &&
            (cost = CanBuyWorkerWithResource(game.jobs.Scientist, 1, food, buy.Scientist)) !== -1) {
            food -= cost;
            buy.Scientist += 1;
            free--;
        } else if (game.jobs.Magmamancer.locked === 0 &&
            (cost = CanBuyWorkerWithResource(game.jobs.Magmamancer, constants.getMagmamancerCostRatio(), gems, buy.Magmamancer)) !== -1){
            gems -= cost;
            buy.Magmamancer += 1;
            free--;
        } else if (game.jobs.Miner.locked === 0 && game.jobs.Miner.owned + buy.Miner < (game.jobs.Farmer.owned + buy.Farmer) * constants.getMinerMultiplier() &&
            (cost = CanBuyWorkerWithResource(game.jobs.Miner, 1, food, buy.Miner)) !== -1) {
            food -= cost;
            buy.Miner += 1;
            free--;
        } else if (game.jobs.Lumberjack.locked === 0 && game.jobs.Lumberjack.owned + buy.Lumberjack < (game.jobs.Farmer.owned + buy.Farmer) * constants.getLumberjackMultiplier() &&
            (cost = CanBuyWorkerWithResource(game.jobs.Lumberjack, 1, food, buy.Lumberjack)) !== -1){
            food -= cost;
            buy.Lumberjack += 1;
            free--;
        } else if ((cost = CanBuyWorkerWithResource(game.jobs.Farmer, 1, food, buy.Farmer)) !== -1){
            food -= cost;
            buy.Farmer += 1;
            free--;
        } else {
            break; //Can't afford anything!
        }
    }
    var jobName;
    var numberToBuy;
    for (jobName in buy){
        numberToBuy = buy[jobName];
        if (numberToBuy > 0){
            game.global.buyAmt = numberToBuy;
            buyJob(jobName, null, true);
        }
    }
    game.global.buyAmt = 1;
}
function Fight() {
    "use strict";
    
    if (game.resources.trimps.soldiers==0 || game.global.fighting==false)
    {
        var cellNum = game.global.lastClearedCell + 1;
        var cell = game.global.gridArray[cellNum];
        var cellElem = document.getElementById("cell" + cellNum);
		if (cellElem == null) return;
        fightManual();
    }
}
function ShowRunningIndicator() {
    "use strict";
    var rotater = ["|", "/", "-", "\\"][trimpz];
    trimpz += 1;
    if (trimpz > 3) {
        trimpz = 0;
    }
    document.getElementById("trimpTitle").innerHTML = "Trimpz " + rotater;
}

function getMaxResource(resource)
{
    "use strict";
    var theResource = game.resources[resource];
    var newMax = theResource.max + (theResource.max * game.portal.Packrat.modifier * game.portal.Packrat.level);
    newMax = calcHeirloomBonus("Shield", "storageSize", newMax);
    return newMax;
}

function queueContainsItem(item){
    "use strict";
    for (var queued in game.global.buildingsQueue) {
        if (game.global.buildingsQueue[queued].indexOf(item) > -1)
            return true;
    }
    return false;
}

/*function UpgradeStorage() {
    "use strict";
    var storageBuildings = {
        'Barn': 'food',
        'Shed': 'wood',
        'Forge': 'metal'
    };

    var jestImpLoot;
    var resource;
    var owned;
    var maxResource;
    var storageBuilding;
    for (var storage in storageBuildings) {
        resource = storageBuildings[storage];
        owned = game.resources[resource].owned;
        maxResource = getMaxResource(resource);
        storageBuilding = game.buildings[storage];
        if (owned > storageBuilding.cost[resource]() &&
            storageBuilding.locked === 0 && !queueContainsItem(storage))
            if (getChronoImpLoot(resource) + owned > 0.9 * maxResource) {
                buyBuilding(storage, true, true);
            } else if ((game.global.mapsActive && game.unlocks.imps.Jestimp)) {
                jestImpLoot = simpleSeconds(resource, 45);
                jestImpLoot = scaleToCurrentMap(jestImpLoot);
                if (jestImpLoot + owned > 0.85 * maxResource) {
                    buyBuilding(storage, true, true);
                }
            }
    }
}*/

function ClickAllNonEquipmentUpgrades() {
    "use strict";
    var upgrade;
    for (upgrade in game.upgrades) {
        if (upgrade === "Gigastation"){
            continue;
        }
        if (upgrade === "Shieldblock"){
            continue;
        }
        if (upgrade === "Coordination"){
            continue;
        }
        if (typeof game.upgrades[upgrade].prestiges == 'undefined' && game.upgrades[upgrade].locked === 0) {
            buyUpgrade(upgrade,true,true);  //Upgrade!
        }
    }
}

function ClickButton(button){
    var btn;
    if (typeof button === "string")
        btn = document.getElementById(button);
    else
        btn = button;
    if (btn && btn.click)
        btn.click();
}

function FocusWorkersOn(jobToFocusOn) {
    "use strict";
    var jobObj;
    var workersToMove;
    var jobsToMoveFrom = ["Farmer", "Lumberjack", "Miner"];
    var job;

    if (game.jobs[jobToFocusOn].locked) {
        return;
    }
    if (workersFocused === true && jobToFocusOn === workersFocusedOn) {
        return;
    }
    if (workersFocused === true){ //focused on the wrong thing!
        RestoreWorkerFocus();
        if (workersFocused === true){
            return;
        }
    }
    workersMoved = [];
    for (job in jobsToMoveFrom) {
        jobObj = game.jobs[jobsToMoveFrom[job]];
        if (jobObj.locked === true || jobObj.owned < 2 || jobsToMoveFrom[job] === jobToFocusOn) {
            continue;
        }
        workersToMove = Math.floor(jobObj.owned * constants.getOtherWorkersFocusRatio());
        if (game.resources.food.owned < workersToMove * game.jobs[jobToFocusOn].cost.food) {
            continue;
        }
        game.global.buyAmt = workersToMove;
        game.global.firing = true;
        buyJob(jobsToMoveFrom[job], null, true);
        game.global.firing = false;
        buyJob(jobToFocusOn, null, true);
        game.global.buyAmt = 1;
        workersMoved.push([jobsToMoveFrom[job], workersToMove, jobToFocusOn]);
    }
    if (workersMoved.length !== 0) {
        workersFocused = true;
        workersFocusedOn = jobToFocusOn;
    }
}
function RestoreWorkerFocus() {
    "use strict";
    var workersToMove;
    var job;
    var workersLeft = 0;
    var jobMoved;

    if (workersFocused === false){
        return;
    }
    for (jobMoved in workersMoved)
    {
        workersToMove = workersMoved[jobMoved][1];
        job = workersMoved[jobMoved][0];
        if (game.resources.food.owned <  workersToMove * game.jobs[job].cost.food || workersToMove === 0){
            workersLeft += workersToMove;
            continue;
        }
        game.global.buyAmt = workersToMove;
        game.global.firing = true;
        buyJob(workersMoved[jobMoved][2], null, true);
        game.global.firing = false;
        buyJob(job, null, true);
        game.global.buyAmt = 1;
        workersMoved[jobMoved][1] = 0;
    }
    if (workersLeft === 0) {
        workersFocused = false;
        workersFocusedOn = "";
    }
}

function CanBuyWarpstationSoon(){
    "use strict";
    var MaxMinutesToWait = 2;
    var buildstring = canAffordBuilding("Warpstation",false,true);

    if (buildstring.indexOf("Days") > -1 || buildstring.indexOf("Hours") > -1 || buildstring.indexOf("Long") > -1){
        return false;
    }
    return true;
/*    if (buildstring.indexOf("Mins") == -1){
        return true;
    }
    var buildStringArray = buildstring.split(" ");
    var minutesIndex = buildStringArray.indexOf("Mins");
    if (typeof minutesIndex == 'undefined') return true;
    var minutesString = buildStringArray[minutesIndex - 1].split("(")[1];
    var minutes = parseInt(minutesString, 10);

    if (minutesIndex == buildStringArray.lastIndexOf("Mins")){
        return minutes <= MaxMinutesToWait;
    }

    var minutes2Index = buildStringArray.lastIndexOf("Mins");
    var minutes2String = buildStringArray[minutes2Index - 1].split("(")[1];
    var minutes2 = parseInt(minutes2String, 10);
    return !(minutes > MaxMinutesToWait || minutes2 > MaxMinutesToWait);*/
}

function UpgradeNonEquipment() {
    "use strict";
    var upgrade;
    var aResource;
    var needed;
    for (upgrade in game.upgrades) {
        if (typeof game.upgrades[upgrade].prestiges == 'undefined' && game.upgrades[upgrade].locked === 0) {
            if (upgrade === "Gigastation")
            {
                if (game.buildings.Warpstation.owned < trimpzSettings["minimumWarpStations"].value + trimpzSettings["deltaIncreaseInMinimumWarpstationsPerGigastationPurchase"].value * game.upgrades.Gigastation.done
                || (CanBuyWarpstationSoon() && CanBuyNonUpgrade(game.buildings.Warpstation, 2) === true) ) //ratio 2 for "can buy soon"
                    continue;
                else
                    warpsAtLastGiga = game.buildings.Warpstation.owned;
            }
            if (game.global.challengeActive == "Trapper" && upgrade == 'Coordination' && ableToOverkillAllMobs()) continue;
            if (upgrade == 'Coordination' && !canAffordCoordinationTrimps())
            {
                if (unusedCoordsAt==0 && game.global.lastClearedCell>60)
                    unusedCoordsAt = game.global.world;
                continue;
            }
            if (upgrade === "Shieldblock"){
                continue;
            }
            for (aResource in game.upgrades[upgrade].cost.resources) {
                needed = game.upgrades[upgrade].cost.resources[aResource];
                if (typeof needed[1] != 'undefined') {
                    needed = resolvePow(needed, game.upgrades[upgrade]);
                }
                if (aResource === "food" && needed > game.resources.food.owned) {
                    setGather("food");
                    FocusWorkersOn("Farmer");
                    return true;
                }
                if (game.jobs.Miner.locked === 0 && aResource === "metal" && needed > game.resources.metal.owned) {
                    setGather("metal");
                    FocusWorkersOn("Miner");
                    return true;
                }
                if (game.jobs.Scientist.locked === 0 && aResource === "science" && needed > game.resources.science.owned && document.getElementById('scienceCollectBtn').style.display == 'block') {
                    setGather("science");
                    FocusWorkersOn("Scientist");
                    return true;
                }
                if (game.jobs.Lumberjack.locked === 0 && aResource === "wood" && needed > game.resources.wood.owned) {
                    setGather("wood");
                    FocusWorkersOn("Lumberjack");
                    return true;
                }
            }
            buyUpgrade(upgrade,true,true);  //Upgrade!
        }
    }
    RestoreWorkerFocus();
    return false;
}

function GetBreedSpeed() {
    "use strict";
    var breedArray = document.getElementById("trimpsPs").innerHTML.match(/(\d+(?:\.\d+)?)(\D+)?(?:\/sec)/);
    return unprettify(breedArray);
}

/**
 * @return {boolean} return.collectingForNonEquipment Is it collecting for upgrade?
 */
function UpgradeAndGather() {
    "use strict";
    var collectingForNonEquipment = UpgradeNonEquipment();
    if (collectingForNonEquipment)
        return true;
    if (game.jobs.Scientist.locked !== 0 ) return;
    if (game.global.autoCraftModifier < 5000 && (game.global.buildingsQueue.length > 0 &&
        (game.global.buildingsQueue[0] !== "Trap.1") || game.global.buildingsQueue.length > 1)) {
        setGather("buildings");
    }
    else if (game.global.turkimpTimer > 0) {
        setGather("metal");
    } else {
        setGather("science");
    }
    if (game.global.mapsActive === true && game.global.preMapsActive === false)
    {
        var map = getCurrentMapObject()
        var specials = addSpecials(true, true, map);
        if ((specials==3 || specials==2) && map.level%10 == 1)
            return true;
    }
    return false;
}
/**
 * @return {boolean} return.shouldReturn Was priority found (stop further processing)?
 */
/*function BeginPriorityAction() { //this is really just for the beginning (after a portal)
    "use strict";
    if (game.global.buildingsQueue.length > 0) {//Build queue
        if ( !game.global.trapBuildToggled||
            game.global.buildingsQueue[0] !== "Trap.1") {
            setGather("buildings");
            return false;
        }
    }
    if (game.resources.food.owned < constants.getMinFoodOwned()) {//Collect food
        setGather("food");
        return true;
    }
    if (game.resources.wood.owned < constants.getMinWoodOwned()) {//Collect wood
        setGather("wood");
        return true;
    }
    if (game.buildings.Trap.owned < 1 && !queueContainsItem("Trap")) {//Enqueue trap
        buyBuilding("Trap", true, true);
        setGather("buildings");
        return true;
    }
    if (game.resources.trimps.owned < constants.getMinTrimpsOwned() &&
        game.resources.trimps.owned < game.resources.trimps.realMax()/2) {//Open trap
        setGather("trimps");
        return true;
    }
    if (game.resources.science.owned < constants.getMinScienceOwned() && document.getElementById('scienceCollectBtn').style.display == 'block') {//Collect science
        setGather("science");
        return true;
    }
    return false;
}*/

/**
 * @return {boolean}
 */
function BuyBuilding(buildingName, ratio, max, checkQueue){
    "use strict";
    if (typeof max === 'undefined'){
        max = 999999999999999999999999999999;
    }
    if (typeof checkQueue === 'undefined') {
        checkQueue = true;
    }
    if (checkQueue && queueContainsItem(buildingName)){
        return false;
    }

    var theBuilding = game.buildings[buildingName];
    if (theBuilding.locked === 0 && theBuilding.owned < max &&
        CanBuyNonUpgrade(theBuilding, ratio) === true) {
        buyBuilding(buildingName,true,true);
        return true;
    }
    return false;
}

/**
 * @return {boolean}
 */
/*function ShouldLowerBreedWithoutGeneticists(){
    "use strict";
    var targetBreedTime = trimpzSettings["targetBreedTime"].value;
    var targetBreedTimeHysteresis = trimpzSettings["targetBreedTimeHysteresis"].value;
    //noinspection RedundantIfStatementJS
    if (getTotalTimeForBreeding(0) >= targetBreedTime - targetBreedTimeHysteresis ||
        ((game.jobs.Geneticist.locked === 1 || game.jobs.Geneticist.owned === 0) && getRemainingTimeForBreeding() >= targetBreedTime + targetBreedTimeHysteresis * 2)){
        return true;
    }
    return false;
}*/

function BuyBuildings() {
    "use strict";
    BuyBuilding("Gym", constants.getGymCostRatio(), constants.getMaxGyms());

    var targetBreedTime = trimpzSettings["targetBreedTime"].value;
    var targetBreedTimeHysteresis = trimpzSettings["targetBreedTimeHysteresis"].value;
    if (!(game.global.mapsActive === true && game.global.preMapsActive === false)){
        game.global.buyAmt = 'Max';
//        game.global.maxSplit = constants.getNurseryCostRatio();
 //       BuyBuilding("Nursery", constants.getNurseryCostRatio());
        game.global.maxSplit = constants.getTributeCostRatio();
        BuyBuilding("Tribute", constants.getTributeCostRatio());
        game.global.buyAmt = 1;
        game.global.maxSplit = 1;
    }
    else
    {
//        if (ShouldLowerBreedWithoutGeneticists())
//            BuyBuilding("Nursery", constants.getNurseryCostRatio());
        BuyBuilding("Tribute", constants.getTributeCostRatio());
    }
    
    if (getEnemyAttackForLevel(game.global.world)>game.global.soldierHealthMax/50)
    {
        game.global.buyAmt = 2;
        BuyBuilding("Nursery", constants.getNurseryCostRatio());
        game.global.buyAmt = 1;
    }

    BuyBuilding("Hut", constants.getHousingCostRatio());
    BuyBuilding("House", constants.getHousingCostRatio());
    BuyBuilding("Mansion", constants.getHousingCostRatio());
    BuyBuilding("Hotel", constants.getHousingCostRatio());
    BuyBuilding("Resort", constants.getHousingCostRatio());
    BuyBuilding("Gateway", constants.getHousingCostRatio());
    if (game.buildings.Warpstation.locked === 1 || GetNonUpgradePrice(game.buildings.Warpstation, "gems") > GetNonUpgradePrice(game.buildings.Collector) * game.buildings.Warpstation.increase.by / game.buildings.Collector.increase.by) {
        game.global.buyAmt = 2;
        BuyBuilding("Collector", 1);
        game.global.buyAmt = 1;
    }

    if (game.upgrades.Gigastation.done === game.upgrades.Gigastation.allowed && game.upgrades.Gigastation.done >= trimpzSettings["gsForEqWs"].value) {
        var eqCost = FindAndBuyEquipment("Attack", true);
        if (eqCost !== 0 && eqCost < GetNonUpgradePrice(game.buildings.Warpstation, "metal") * trimpzSettings["eqWsRatio"].value){
            return;
        }
    }
    
    if (game.global.world<240)
    {
        game.global.buyAmt = 'Max';
        buyBuilding("Warpstation", true, true);
        game.global.buyAmt = 1;
    }
}

function BuyShield() {
    "use strict";
    var shieldUpgrade = game.upgrades.Supershield;
    var shield = game.equipment.Shield;

    var stat = shield.blockNow ? "block" : "health";
    var upgradeStats = GetRatioForEquipmentUpgrade("Supershield",shield);

    if (shieldUpgrade.locked === 0 && canAffordTwoLevel(shieldUpgrade)){
        buyUpgrade("Supershield", true, true);  //Upgrade!
    }
    else if (shield[stat + "Calculated"]/GetNonUpgradePrice(shield) > upgradeStats.gainPerMetal){ //level up (don't feel like renaming gainPerMetal...)
        if (shield.locked === 0 && CanBuyNonUpgrade(shield, constants.getShieldCostRatio()) === true){
            buyEquipment("Shield", true, true);
        }
    }
}
function FindBestEquipmentToLevel(filterOnStat) {
    "use strict";
    var anEquipment;
    var bestEquipGainPerMetal = 0;
    var bestEquipment;
    var bestEquipmentCost;
    var gainPerMetal;
    var cost;
    var currentEquip;
    var multiplier;
    for (anEquipment in game.equipment) {
        currentEquip = game.equipment[anEquipment];
        if (currentEquip.locked === 1 || anEquipment === "Shield" || (constants.getShouldSkipHpEquipment() === true && typeof currentEquip.health != 'undefined')) {
            continue;
        }
        if (filterOnStat){
            if (filterOnStat === "Health"){
                if (!currentEquip.healthCalculated){
                    continue;
                }
                if (currentEquip.prestige<game.equipment["Boots"].prestige-1) continue;
            } else { //Attack
                if (currentEquip.healthCalculated){
                    continue;
                }
                if (currentEquip.prestige<game.equipment["Dagger"].prestige-1) continue;
            }
        }
        
        cost = GetNonUpgradePrice(currentEquip);
        multiplier = currentEquip.healthCalculated ? 1 / 8 : 1;
        gainPerMetal = (currentEquip.healthCalculated || currentEquip.attackCalculated) * multiplier / cost;
        if (gainPerMetal > bestEquipGainPerMetal) {
            bestEquipGainPerMetal = gainPerMetal;
            bestEquipment = anEquipment;
            bestEquipmentCost = cost;
        }
    }
    return {
        bestEquipGainPerMetal: bestEquipGainPerMetal,
        bestEquipment: bestEquipment,
        bestEquipmentCost: bestEquipmentCost
    };
}
function GetRatioForEquipmentUpgrade(upgrade, currentEquip) {
    var stat;

    var cost = Math.ceil(getNextPrestigeCost(upgrade) * (Math.pow(1 - game.portal.Artisanistry.modifier, game.portal.Artisanistry.level)));
    var multiplier = currentEquip.healthCalculated ? 1 / 8 : 1;
    if (currentEquip.blockNow) stat = "block";
    else stat = (typeof currentEquip.health != 'undefined') ? "health" : "attack";
    var gain = Math.round(currentEquip[stat] * Math.pow(1.19, ((currentEquip.prestige) * game.global.prestige[stat]) + 1));
    var gainPerMetal = gain * multiplier / cost;
    return {
        gainPerMetal: gainPerMetal,
        cost: cost
    };
}

function FindBestEquipmentUpgrade(filterOnStat) {
    "use strict";
    var gainPerMetal;
    var cost;
    var currentEquip;
    var upgrade;
    var currentUpgrade;
    var bestUpgradeGainPerMetal = 0;
    var bestUpgrade;
    var bestUpgradeCost;
    var upgradeStats;

    for (upgrade in game.upgrades) {
        currentUpgrade = game.upgrades[upgrade];
        currentEquip = game.equipment[game.upgrades[upgrade].prestiges];
        if (typeof currentUpgrade.prestiges != 'undefined' && currentUpgrade.locked === 0 && upgrade !== "Supershield") {
            if (constants.getShouldSkipHpEquipment() === true && typeof currentEquip.health != 'undefined') { //don't buy hp equips in late late game
                continue;
            }
            if (filterOnStat){
                if (filterOnStat === "Health"){
                    if (!currentEquip.healthCalculated){
                        continue;
                    }
                } else { //Attack
                    if (currentEquip.healthCalculated){
                        continue;
                    }
                }
            }
            upgradeStats = GetRatioForEquipmentUpgrade(upgrade, currentEquip);
            gainPerMetal = upgradeStats.gainPerMetal;
            cost = upgradeStats.cost;
            if (gainPerMetal > bestUpgradeGainPerMetal) {
                bestUpgradeGainPerMetal = gainPerMetal;
                bestUpgrade = upgrade;
                bestUpgradeCost = cost;
            }
        }
    }
    return {
        bestUpgradeGainPerMetal: bestUpgradeGainPerMetal,
        bestUpgrade: bestUpgrade,
        bestUpgradeCost: bestUpgradeCost
    };
}
function BuyEquipmentOrUpgrade(bestEquipGainPerMetal, bestUpgradeGainPerMetal, bestEquipment, bestUpgrade, bestUpgradeCost) {
    "use strict";
    if (CanAffordEquipmentUpgrade(bestUpgrade) === true && bestUpgradeCost < game.resources.metal.owned * constants.getEquipmentCostRatio()) {
        buyUpgrade(bestUpgrade, true, true);
        return true;
    }
    else if (CanBuyNonUpgrade(game.equipment[bestEquipment], constants.getEquipmentCostRatio()) === true) {
        var upgrade = Object.keys(game.upgrades).filter(function(a){return game.upgrades[a].prestiges === bestEquipment;})[0];
        var upgradeStats = GetRatioForEquipmentUpgrade(upgrade, game.equipment[bestEquipment]);
        if (upgradeStats.gainPerMetal < bestEquipGainPerMetal || (game.global.world>230 && game.equipment[bestEquipment].level<100) || game.global.world>=trimpzSettings["voidMapsAt"].value-10) {
            buyEquipment(bestEquipment, true, true);
            return true;
        }
    }
    return false;
}
function BuyCheapEquipment() {
    "use strict";
    var anEquipment;
    var currentEquip;
    for (anEquipment in game.equipment) {
        currentEquip = game.equipment[anEquipment];
        if (currentEquip.locked === 1 || anEquipment === "Shield" || (constants.getShouldSkipHpEquipment() === true && typeof currentEquip.health != 'undefined')) {
            continue;
        }
        if (CanBuyNonUpgrade(game.equipment[anEquipment], trimpzSettings["CheapEquipmentRatio"].value) === true) {
            buyEquipment(anEquipment, true, true);
        }
    }
    return currentEquip;
}
function BuyCheapEquipmentUpgrades() {
    "use strict";
    var currentEquip;
    var upgrade;
    var cost;
    var currentUpgrade;
    for (upgrade in game.upgrades) {
        currentUpgrade = game.upgrades[upgrade];
        currentEquip = game.equipment[game.upgrades[upgrade].prestiges];
        if (typeof currentUpgrade.prestiges != 'undefined' && currentUpgrade.locked === 0 && upgrade !== "Supershield") {
            if (constants.getShouldSkipHpEquipment() === true && typeof currentEquip.health != 'undefined') { //don't buy hp equips in late late game
                continue;
            }
            cost = Math.ceil(getNextPrestigeCost(upgrade) * (Math.pow(1 - game.portal.Artisanistry.modifier, game.portal.Artisanistry.level)));
            if (CanAffordEquipmentUpgrade(upgrade) === true && cost < game.resources.metal.owned * trimpzSettings["CheapEqUpgradeRatio"].value) {
                buyUpgrade(upgrade, true, true);
            }
        }
    }
}

function FindAndBuyEquipment(stat, justgetcost) {
    "use strict";
    var retFBETL = FindBestEquipmentToLevel(stat);
    var bestEquipGainPerMetal = retFBETL.bestEquipGainPerMetal;
    var bestEquipment = retFBETL.bestEquipment;

    var retFBEU = FindBestEquipmentUpgrade(stat);
    var bestUpgradeGainPerMetal = retFBEU.bestUpgradeGainPerMetal;
    var bestUpgrade = retFBEU.bestUpgrade;
    var bestUpgradeCost = retFBEU.bestUpgradeCost;

    if (bestEquipGainPerMetal === 0 && bestUpgradeGainPerMetal === 0) {   //nothing to buy
        if (justgetcost)
            return 0;
        return;
    }
    if (justgetcost)
        return bestEquipGainPerMetal > bestUpgradeGainPerMetal ? retFBETL.bestEquipmentCost : bestUpgradeCost;
    BuyEquipmentOrUpgrade(bestEquipGainPerMetal, bestUpgradeGainPerMetal, bestEquipment, bestUpgrade, bestUpgradeCost);
}

function BuyMetalEquipment() {
    "use strict";
    
//    if (getEnemyAttackForLevel(game.global.world)>game.global.soldierHealthMax/70)
    if (game.global.soldierHealth/game.global.soldierHealthMax<trimpzSettings["hpEquipment"].value)
        FindAndBuyEquipment("Health");
    FindAndBuyEquipment("Attack");
        
    BuyCheapEquipmentUpgrades();
}

/**
 * @return {boolean} return.canAfford affordable upgrade?
 */
function CanAffordEquipmentUpgrade(upgrade) {
    "use strict";
    var canBuyUpgrade = true;
    var aResource;
    var needed;
    
    if (typeof upgrade=='undefined') return false;
    
    for (aResource in game.upgrades[upgrade].cost.resources) {
        if (aResource === "metal" || aResource === "wood") {
            continue;
        }
        needed = game.upgrades[upgrade].cost.resources[aResource];
        if (typeof needed[1] != 'undefined') {
            needed = resolvePow(needed, game.upgrades[upgrade]);
        }
        if (needed > game.resources[aResource].owned) {
            canBuyUpgrade = false;
            break;
        }
    }
    return canBuyUpgrade;
}

function unprettify(splitArray) {
    "use strict";
    var suffices = [
        'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc', 'Ud',
        'Dd', 'Td', 'Qad', 'Qid', 'Sxd', 'Spd', 'Od', 'Nd', 'V', 'Uv', 'Dv',
        'Tv', 'Qav', 'Qiv', 'Sxv', 'Spv', 'Ov', 'Nv', 'Tt'
    ];
    var suffixIndex = suffices.indexOf(splitArray[2]);
    var base = suffixIndex + 1;
    return splitArray[1] * Math.pow(1000, base);
}

function getBossAttack(isVoidBoss) {
    "use strict";
    var baseAttack;
    if (isVoidBoss){
        baseAttack = getEnemyAttackForLevel(game.global.world, false, "Cthulimp") * (game.global.world <= 59 ? 3 : 5.4);
        return calculateDamageLocal(baseAttack, false, game.global.world, true);
    } else {
        var cell = game.global.gridArray[99];
        baseAttack = getEnemyAttackForLevel(game.global.world, false, cell.name);
        return calculateDamageLocal(baseAttack, false, game.global.world, false);
    }
}

function getBossHealth(isVoidBoss) {
    "use strict";
    if (isVoidBoss){
        return getAverageEnemyHealthForLevel(game.global.world, false, true) * 5;
    } else {
        return getAverageEnemyHealthForLevel(game.global.world, false, false) * 5;
    }
}

function getSoldierAttack(world, calcForMap){
    "use strict";
    var baseAttack = game.global.soldierCurrentAttack;
    if (game.global.formation === ScryerIndex)
    {
        baseAttack *= 8;  //Dominance is the normal stance.  Fix calculation if scrying.
    }
    return calculateDamageLocal(baseAttack, true, world, calcForMap);
}

function getSoldierCritAttack(world, calcForMap){
    "use strict";
    var baseAttack = game.global.soldierCurrentAttack;
    if (game.global.formation === ScryerIndex)
    {
        baseAttack *= 8;  //Dominance is the normal stance.  Fix calculation if scrying.
    }
    return calculateDamageLocal(baseAttack, true, world, calcForMap) * getPlayerCritDamageMult();
}

function GotoMapsScreen() {
    "use strict";
    if (game.global.preMapsActive === true) {
        return;
    }
    mapsClicked();
//    if (game.global.fighting && !game.global.preMapsActive){
//        mapsClicked();
//    }
}

function RunNewMap(zoneToCreate) {
    "use strict";
    var newMap;
    var size = 9;   //0-9
    var difficulty = 9; //0-9
    var loot = 9; //0-9
    var biome = "Plentiful";

    GotoMapsScreen();

    if (game.global.challengeActive == "Metal")
        biome = "Mountain";

    difficultyAdvMapsRange.value = difficulty;
    adjustMap('difficulty', difficulty);
    sizeAdvMapsRange.value = size;
    adjustMap('size', size);
    lootAdvMapsRange.value = loot;
    adjustMap('loot', loot);
    biomeAdvMapsSelect.value = biome;
    
    if (typeof zoneToCreate != 'undefined') {
        document.getElementById("mapLevelInput").value = zoneToCreate;
    }
    
    var cost = updateMapCost(true);

    while (cost > game.resources.fragments.owned){
        if (size === 1){
            difficulty--;
            if (difficulty === 1) {
                if (game.global.preMapsActive){
                    RunWorld();
                }
                return;         //need more fragments!
            }
        } else if (loot > 1) {
            loot--;
        } else {
            size--;
        }
        document.getElementById("sizeAdvMapsRange").value = size;
        adjustMap('size', size);
        document.getElementById("difficultyAdvMapsRange").value = difficulty;
        adjustMap('difficulty', difficulty);
        cost = updateMapCost(true);
    }
    buyMap();
    newMap = game.global.mapsOwnedArray[game.global.mapsOwnedArray.length - 1];
    RunMap(newMap);
}

function RunNewMapForLoot(zoneToCreate) {
    "use strict";
    var newMap;
    var size = 0;   //0-9
    var difficulty = 9; //0-9
    var loot = 9; //0-9
    var biome = "Plentiful";

    document.getElementById("difficultyAdvMapsRange").value = difficulty;
    adjustMap('difficulty', difficulty);
    document.getElementById("sizeAdvMapsRange").value = size;
    adjustMap('size', size);
    document.getElementById("lootAdvMapsRange").value = loot;
    adjustMap('loot', loot);
    document.getElementById("biomeAdvMapsSelect").value = biome;
    if (typeof zoneToCreate != 'undefined') {
        document.getElementById("mapLevelInput").value = zoneToCreate;
    }
    var cost = updateMapCost(true);
    while (cost > game.resources.fragments.owned){
        if (loot === 1){
            difficulty--;
            if (difficulty === 1) {
                if (game.global.preMapsActive){
                    RunWorld();
                }
                return;         //need more fragments!
            }
        } else {
            loot--;
        }
        document.getElementById("lootAdvMapsRange").value = loot;
        adjustMap('loot', loot);
        document.getElementById("difficultyAdvMapsRange").value = difficulty;
        adjustMap('difficulty', difficulty);
        cost = updateMapCost(true);
    }
    GotoMapsScreen();
    buyMap();
    newMap = game.global.mapsOwnedArray[game.global.mapsOwnedArray.length - 1];
    RunMap(newMap);
}

function RunMap(map) {
    "use strict";
    GotoMapsScreen();
    if (game.global.preMapsActive) {
        selectMap(map.id);
        runMap();
    }
}

function RunWorld() {
    "use strict";
    mapsClicked();
}

function getBadCoordLevelLocal(worldLevel){
    //For Coordinate challenge
    var amt = 1;
    for (var x = 0; x < worldLevel - 1; x++){
        amt = Math.ceil(amt * 1.25);
    }
    return amt;
}

function calculateDamageLocal(number, isTrimp, world, calcForMap) { //number = base attack
    var fluctuation = .2; //%fluctuation
    var maxFluct = -1;
    var minFluct = -1;
    //if (game.global.titimpLeft >= 1 && isTrimp && game.global.mapsActive){
    //    number *= 2;
    //}
    if (isTrimp)
    {
        if (game.challenges.Electricity.stacks > 0) { //Electricity
			number *= (1 - (game.challenges.Electricity.stacks * 0.1));
		}
        if (!calcForMap && game.global.mapBonus > 0){
            number *= ((game.global.mapBonus * 0.2) + 1);
        }
        if (game.global.antiStacks > 0){
            number *= ((game.global.antiStacks * game.portal.Anticipation.level * game.portal.Anticipation.modifier) + 1);
        }
        if (game.global.achievementBonus > 0){
            number *= (1 + (game.global.achievementBonus / 100));
        }
        if (game.global.challengeActive == "Discipline"){
            fluctuation = .995;
        }
        else if (game.portal.Range.level > 0){
            minFluct = fluctuation - (.02 * game.portal.Range.level);
        }
        if (game.global.roboTrimpLevel > 0){
            number *= ((0.2 * game.global.roboTrimpLevel) + 1);
        }
        if (game.global.challengeActive == "Lead" && ((world % 2) == 1)){
			number *= 1.5;
		}
        if (game.goldenUpgrades.Battle.currentBonus > 0){
    			number *= game.goldenUpgrades.Battle.currentBonus + 1;
    	}
    	if (game.global.totalSquaredReward > 0){
    		number *= ((game.global.totalSquaredReward / 100) + 1)
    	}
    	if (getEmpowerment() == "Ice"){
			number *= 1 + (1 - game.empowerments.Ice.getCombatModifier());
		}
		if (game.talents.magmamancer.purchased){
			number *= game.jobs.Magmamancer.getBonusPercent();
		}
		if (game.talents.stillRowing2.purchased){
			number *= ((game.global.spireRows * 0.06) + 1);
		}
		if (game.talents.healthStrength.purchased && mutations.Healthy.active()){
			number *= ((0.15 * mutations.Healthy.cellCount()) + 1);
		}
    	if (game.global.challengeActive == "Daily"){
    		if (typeof game.global.dailyChallenge.minDamage !== 'undefined'){
    			if (minFluct == -1) minFluct = fluctuation;
    			minFluct += dailyModifiers.minDamage.getMult(game.global.dailyChallenge.minDamage.strength);
    		}
    		if (typeof game.global.dailyChallenge.maxDamage !== 'undefined'){
    			if (maxFluct == -1) maxFluct = fluctuation;
    			maxFluct += dailyModifiers.maxDamage.getMult(game.global.dailyChallenge.maxDamage.strength);
    		}
    		if (typeof game.global.dailyChallenge.weakness !== 'undefined'){
    			number *= dailyModifiers.weakness.getMult(game.global.dailyChallenge.weakness.strength, game.global.dailyChallenge.weakness.stacks);
    		}
    		if (typeof game.global.dailyChallenge.oddTrimpNerf !== 'undefined' && ((world % 2) == 1)){
    				number *= dailyModifiers.oddTrimpNerf.getMult(game.global.dailyChallenge.oddTrimpNerf.strength);
    		}
    		if (typeof game.global.dailyChallenge.evenTrimpBuff !== 'undefined' && ((world % 2) == 0)){
    				number *= dailyModifiers.evenTrimpBuff.getMult(game.global.dailyChallenge.evenTrimpBuff.strength);
    		}
    		if (typeof game.global.dailyChallenge.rampage !== 'undefined'){
    			number *= dailyModifiers.rampage.getMult(game.global.dailyChallenge.rampage.strength, game.global.dailyChallenge.rampage.stacks);
    		}
    	}
    }
    else
    {
        if (game.global.challengeActive == "Coordinate"){
            number *= getBadCoordLevelLocal(world);
        }
        if (game.global.challengeActive == "Meditate"){
            number *= 1.5;
        }
        if (game.global.challengeActive == "Corrupted"){
            number *= 3;
        }
        if (game.global.challengeActive == "Watch") {
            number *= 1.25;
        }
    }
    //if (!isTrimp && game.global.challengeActive == "Nom" && typeof cell.nomStacks !== 'undefined'){
    //    number *= Math.pow(1.25, cell.nomStacks);
    //}
    //if (!isTrimp && game.global.usingShriek) {
    //    number *= game.mapUnlocks.roboTrimp.getShriekValue();
    //}
    if (minFluct > 1) minFluct = 1;
    if (maxFluct == -1) maxFluct = fluctuation;
    if (minFluct == -1) minFluct = fluctuation;
    var min = Math.floor(number * (1 - minFluct));
    var max = Math.ceil(number + (number * maxFluct));
    
    number = (max + min)/2;
    return number;
}

function getEnemyAttackForLevel(worldLevel, calcForMap, enemyName) { //adapted from Trimps getEnemyAttack() & startFight()

    var world = worldLevel;
    var level = 100;
    var name = enemyName;
    var difficulty = 0.84;

    var amt = 0;
    amt += 50 * Math.sqrt(world) * Math.pow(3.27, world / 2);
	amt -= 10;
	if (world == 1){
		amt *= 0.35;
		amt = (amt * 0.20) + ((amt * 0.75) * (level / 100));
	}
	else if (world == 2){
		amt *= 0.5;
		amt = (amt * 0.32) + ((amt * 0.68) * (level / 100));
	}
	else if (world < 60)
		amt = (amt * 0.375) + ((amt * 0.7) * (level / 100));
	else{ 
		amt = (amt * 0.4) + ((amt * 0.9) * (level / 100));
		amt *= Math.pow(1.15, world - 59);
	}	
	if (world < 60) amt *= 0.85;
	if (world > 6 && calcForMap) amt *= 1.1;
	if (typeof name !== 'undefined')
	    amt *= game.badGuys[name].attack;
	amt =  Math.floor(amt);
	
	amt*=mutations.Corruption.statScale(3);
	amt *= 2; // Strong

    if (calcForMap) amt *= difficulty;
    if (game.global.challengeActive == "Toxicity") amt *= 5;
    else if (game.global.challengeActive == "Balance")
        amt *= calcForMap ? 2.35 : 1.17;
    return amt;
}

function getAverageEnemyHealthForLevel(worldLevel, isMap, isVoid) {  //adapted from Trimps getEnemyHealth() & startFight()
    "use strict";
    var world = worldLevel;
    var level = isMap ? 20 : 95;
    var difficulty = isVoid ? 4 : 0.8;
    var badCoord = 1;
    
    if (game.global.challengeActive == "Coordinate")
    {
	    for (var x = 0; x < world - 1; x++)
		    badCoord = Math.ceil(badCoord * 1.25);
	}

    var amt = 0;
	amt += 130 * Math.sqrt(world) * Math.pow(3.265, world / 2);
	amt -= 110;
	if (world == 1 || world == 2 && level < 10){
		amt *= 0.6;
	amt = (amt * 0.25) + ((amt * 0.72) * (level / 100));
	}
	else if (world < 60)
		amt = (amt * 0.4) + ((amt * 0.4) * (level / 110));
	else{
		amt = (amt * 0.5) + ((amt * 0.8) * (level / 100));
		amt *= Math.pow(1.1, world - 59);
	}
	if (world < 60) amt *= 0.75;		
	if (world > 5 && (isMap || isVoid)) amt *= 1.1;
	
	var corruptionStart = mutations.Corruption.start(true);
	if (!isMap && !isVoid && world >= corruptionStart)
		amt *= mutations.Corruption.statScale(10);
		
    if (game.global.challengeActive == "Coordinate") amt *= badCoord;
    if (isMap || isVoid) {
        amt *= difficulty;
		if (world >= corruptionStart)
		{
    		if (mutations.Magma.active() && isVoid){
				amt *= (mutations.Corruption.statScale(10)).toFixed(1);
			}
			else if (isVoid || mutations.Magma.active()){
				amt *= (mutations.Corruption.statScale(10) / 2).toFixed(1);
			}
		}
    }
	if (game.global.challengeActive == "Meditate" || game.global.challengeActive == "Toxicity" || game.global.challengeActive == "Balance") amt *= 2;
    if (game.global.challengeActive == "Daily")
    {
		if (typeof game.global.dailyChallenge.badHealth !== 'undefined'){
			amt *= dailyModifiers.badHealth.getMult(game.global.dailyChallenge.badHealth.strength);
		}
		if (typeof game.global.dailyChallenge.badMapHealth !== 'undefined' && (isMap || isVoid)){
			amt *= dailyModifiers.badMapHealth.getMult(game.global.dailyChallenge.badMapHealth.strength);
		}
	}	
	return Math.floor(amt);
}

function getLevelOfOverkillMap(){
    "use strict";
    var soldierAttack = getSoldierCritAttack(game.global.world, true);
    var enemyHealth;
    var attack;
    
    if (game.unlocks.imps.Titimp) soldierAttack *= 2;
    
    if (game.global.formation == 2)
        soldierAttack /= 8; //Maps will be run with less attack in Scryer formation.
        

    for (var mapLevel = game.global.world; mapLevel > 6; mapLevel--) {
        enemyHealth = getAverageEnemyHealthForLevel(mapLevel, true, false);
        attack = soldierAttack - enemyHealth;
        if (attack < 1) continue;
        if (attack * game.portal.Overkill.level * 0.005 >= enemyHealth) return mapLevel;
    }
    return 6;

}

function getLevelOfOneShotMap(){
    "use strict";
    var soldierAttack = getSoldierAttack(game.global.world, true);
    if (game.global.formation == 2)
        soldierAttack /= 8; //Maps will be run with less attack in Scryer formation.
        
    if (getEmpowerment() == "Poison")
        soldierAttack += Math.ceil(game.empowerments.Poison.getModifier() * soldierAttack)

    for (var mapLevel = game.global.world; mapLevel > 6; mapLevel--) {
        var maxEnemyHealth = getAverageEnemyHealthForLevel(mapLevel, true, false);
        if (soldierAttack >= maxEnemyHealth){
            return mapLevel;
        }
    }
    return 6;
}
function getCurrentAvailableDrops(){
    return addSpecials(true,true,{ id: "map999", name: "My Map", location: "Sea", clears: 0, level: game.global.world, difficulty: 1.11, size: 40, loot: 1.2, noRecycle: false });
}

function getMinLevelOfMapWithDrops(){
    var mapLevelWithDrop;
    var itemsAvailableInNewMap;
    for (mapLevelWithDrop = 6; mapLevelWithDrop <= game.global.world; mapLevelWithDrop++){
        itemsAvailableInNewMap = addSpecials(true,true,{ id: "map999", name: "My Map", location: "Sea", clears: 0, level: mapLevelWithDrop, difficulty: 1.11, size: 40, loot: 1.2, noRecycle: false });
        if (itemsAvailableInNewMap > 0)
        {
            break;
        }
    }
    if (mapLevelWithDrop > game.global.world)
        mapLevelWithDrop = game.global.world;
    return mapLevelWithDrop;
}

function FindAndRunSmallMap(mapLevel) {
    var map;
    var theMap;
    for (map in game.global.mapsOwnedArray) {
        theMap = game.global.mapsOwnedArray[map];
        if (theMap.level === mapLevel && theMap.size <= 40){
            RunMap(theMap);
            return;
        }
    }
    RunNewMap(mapLevel);
}

function FindAndRunLootMap(mapLevel) {
    var map;
    var theMap;
    for (map in game.global.mapsOwnedArray) {
        theMap = game.global.mapsOwnedArray[map];
        if (theMap.level === mapLevel && theMap.loot >= 1.40 && (theMap.location === "Plentiful" || theMap.location === "Mountain")){
            RunMap(theMap);
            return;
        }
    }
    RunNewMapForLoot(mapLevel);
}

function isPrestigeFull(filterOnStat, highestUpgrade) {
    "use strict";
    var currentEquip;
    var upgrade;
    var currentUpgrade;

    for (upgrade in game.upgrades) {
        currentUpgrade = game.upgrades[upgrade];
        currentEquip = game.equipment[game.upgrades[upgrade].prestiges];
        if (typeof currentUpgrade.prestiges != 'undefined' && !currentEquip.locked && upgrade !== "Supershield") {
            if (filterOnStat){
                if (filterOnStat === "Health"){
                    if (!currentEquip.healthCalculated){
                        continue;
                    }
                } else { //Attack
                    if (currentEquip.healthCalculated){
                        continue;
                    }
                }
            }
            if (currentUpgrade.locked){
                return false;
            }
            if (highestUpgrade && upgrade === highestUpgrade){
                return true;
            }
        }
    }
    return true;
}

function getNumberOfUpgradesOnHand() {
    var upgrade;
    var currentUpgrade;
    var currentEquip;
    var totalUpgrades = 0;
    for (upgrade in game.upgrades) {
        currentUpgrade = game.upgrades[upgrade];
        currentEquip = game.equipment[game.upgrades[upgrade].prestiges];
        if (typeof currentUpgrade.prestiges != 'undefined' && currentUpgrade.locked === 0 && upgrade !== "Supershield") {
            if (constants.getShouldSkipHpEquipment() === true && typeof currentEquip.health != 'undefined') { //don't buy hp equips in late late game
                continue;
            }
            totalUpgrades++;
        }
    }
    return totalUpgrades;
}

function ManageRepeatMaps() {
    var prestige;
    var mapLevelWithDrop;
    var shouldRepeat = false;
    var mapBonus = game.global.mapBonus;
    var item;
    var lastDrop;
    
    if (getCurrentMapObject().name.indexOf("Bionic") > -1) return;

    if (mapRunStatus) {
        if (mapRunStatus === "Prestige") {
            if (!ableToOverkillAllMobs() && mapBonus < 9)
            {
                var specials = addSpecials(true, true, getCurrentMapObject());
                if (specials > 2 )
                    shouldRepeat = true;
                else if (specials==2 && (getCurrentMapObject().level-1) % 10 < 5)
                    shouldRepeat = true;
/*                prestige = trimpzSettings["prestige"].value;
                var mapDrop = game.global.mapGridArray[game.global.mapGridArray.length - 1].special;
                if (mapDrop)
                {
                    lastDrop = game.mapUnlocks[mapDrop].last;
                    for (item in prestiges)
                    {
                        lastDrop = game.mapUnlocks[prestiges[item]].last;
                        if (mapDrop && !isPrestigeFull(null, prestiges[item]) && lastDrop < game.global.world - 5)
                        {
                            shouldRepeat = true;
                            break;
                        }
                        if (prestiges[item]==prestige) break;
                    }
                    var lastDrop = game.mapUnlocks[prestige].last;
                    if (!isPrestigeFull(null, prestige) && mapDrop && lastDrop <= game.global.world - 5) {
                        shouldRepeat = !(mapDrop === prestige && ~~((lastDrop-1)/10) >= ~~((game.global.world-1)/10)-1);
                    }
                }*/
            }
        }
        else if (mapRunStatus === "Bonus") {
            if (mapBonus < 9) {
                shouldRepeat = !ableToOneShotAllMobs();
            }
        }
        else if (mapRunStatus === "Loot") {
            shouldRepeat = !ableToOneShotAllMobs() || reallyNeedLoot();
        }
        else if(trimpzSettings["shouldMaxOutToxicityHelium"].value && game.global.challengeActive === 'Toxicity' && game.global.lastClearedCell > trimpzSettings["lastCell"].value && game.challenges.Toxicity.stacks < 1500 && game.global.world >= trimpzSettings["zoneToStartMaxingAt"].value)
            shouldRepeat = true;

//        if (!ableToOverkillAllMobs() && ableToGetChronoUpgrade() && mapBonus < 9) shouldRepeat = true;
    }
    if (game.global.repeatMap !== shouldRepeat) {
        repeatClicked();
    }
}

/**
 * @return {boolean}
 */
function RunPrimaryUniqueMaps(){
    var map;
    var theMap;
    
    if (game.global.runningChallengeSquared) return false;

    if (game.upgrades.Bounty.done === 0 && game.upgrades.Bounty.locked === 1) {
        for (map in game.global.mapsOwnedArray) {
            theMap = game.global.mapsOwnedArray[map];
            if (theMap.name === "The Wall" && addSpecials(true, true, theMap) > 0){
                RunMap(theMap);
                return true;
            }
        }
    }
    
    if (game.global.challengeActive === "Electricity" && game.global.world >= 80) {
        for (map in game.global.mapsOwnedArray) {
            theMap = game.global.mapsOwnedArray[map];
            if (theMap.name === "The Prison"){
                RunMap(theMap);
                return true;
            }
        }
    }

    if (game.global.challengeActive == "Crushed" && bionicDone === false && game.global.world >= 125) {
        for (map in game.global.mapsOwnedArray) {
            theMap = game.global.mapsOwnedArray[map];
            if (theMap.name === "Bionic Wonderland"){
                bionicDone = true;
                RunMap(theMap);
                return true;
            }
        }
    }

    if (game.global.challengeActive === "Meditate" && game.global.world >= 33) {
        for (map in game.global.mapsOwnedArray) {
            theMap = game.global.mapsOwnedArray[map];
            if (theMap.name === "Trimple of Doom"){
                RunMap(theMap);
                return true;
            }
        }
    }
    return false;
}

/**
 * @return {boolean}
 */
function RunPrestigeMaps(){
    "use strict";
    var map;
    var theMap;
    var mapLevelWithDrop;
    var siphonMapLevel;
    var oneShotMapLevel;
    var mapLevelToRun;
    var prestige;
    var item;
    
    prestige = trimpzSettings["prestige"].value;

    if (ableToOverkillAllMobs() || game.global.mapBonus == 10) return;
    for (item in prestiges)
    {
        if (prestige !== "Off" && game.mapUnlocks[prestiges[item]].last <= game.global.world - 5 && !isPrestigeFull(null,prestiges[item])){
            if (game.options.menu.mapLoot.enabled != 1)
                toggleSetting("mapLoot");
            mapLevelWithDrop = game.mapUnlocks[prestiges[item]].last + 5;
            siphonMapLevel = game.global.world - game.portal.Siphonology.level;
            oneShotMapLevel = game.portal.Overkill.level ? getLevelOfOverkillMap() : getLevelOfOneShotMap();
            mapLevelToRun = Math.max(oneShotMapLevel, siphonMapLevel, mapLevelWithDrop);
            setMapRunStatus("Prestige");
            for (map in game.global.mapsOwnedArray){ //look for an existing map first
                theMap = game.global.mapsOwnedArray[map];
                if (uniqueMaps.indexOf(theMap.name) > -1 || theMap.name.indexOf("Bionic Wonderland") > -1){
                    continue;
                }
                if (theMap.level === mapLevelToRun) {
                    RunMap(game.global.mapsOwnedArray[map]);
                    return true;
                }
            }
            RunNewMap(mapLevelToRun);
            return true;
        }
        if (prestiges[item]==prestige) break;
    }
    return false;
}

/**
 * @return {boolean}
 */
function RunUpgradeMaps(){
    
    if (!ableToOverkillAllMobs())
    {
        if (ableToGetChronoUpgrade())
        {
            if (game.global.mapBonus < 10)
            {
                setMapRunStatus("Upgrade");
                FindAndRunSmallMap(game.global.world);
                return true;
            }
        }
        else if (firstOverkillFail ==0) firstOverkillFail = game.global.world;
    }
    return false;
}

/**
 * @return {boolean}
 */
function RunBetterMaps(){
    var siphonMapLevel;
    var oneShotMapLevel;
    var mapLevelToRun;

    if (game.global.mapsUnlocked) {
        if (game.global.lastLowGen === 0 && game.jobs.Geneticist.locked === 0 && trimpzSettings["targetBreedTime"].value > 0) {
            return false;
        }
        if (ableToOneShotAllMobs()) {
            return false;
        }
        if (getEmpowerment() == "Wind" && !game.global.runningChallengeSquared && game.empowerments.Wind.currentDebuffPower < game.empowerments.Wind.maxStacks)
            return false;
        if (game.options.menu.mapLoot.enabled != 1)
            toggleSetting("mapLoot");
        oneShotMapLevel = game.portal.Overkill.level ? getLevelOfOverkillMap() : getLevelOfOneShotMap();
        if (game.global.mapBonus < 10) {
            siphonMapLevel = game.global.world - game.portal.Siphonology.level;
            var minimumDropsLevel = getMinLevelOfMapWithDrops();
            var availableDrops = getCurrentAvailableDrops();
            var prestigeFull = isPrestigeFull("Attack");
            if (availableDrops && !prestigeFull) {
                mapLevelToRun = Math.max(oneShotMapLevel, siphonMapLevel, minimumDropsLevel, 6);
            } else {
                mapLevelToRun = Math.max(oneShotMapLevel, siphonMapLevel, 6);
            }
            if (game.talents.mapLoot.purchased && mapLevelToRun == game.global.world) mapLevelToRun--;
            setMapRunStatus("Bonus");
            FindAndRunSmallMap(mapLevelToRun);
            return true;
        } else if (reallyNeedLoot() && (game.global.challengeActive !== "Lead" || game.global.world % 2 === 1)) {
            setMapRunStatus("Loot");
            FindAndRunLootMap(oneShotMapLevel);
            return true;
        }
    }
    return false;
}

function RunMaps() {
    "use strict";
    if (game.global.world < 7){
        return;
    }
    
    if (game.global.mapsActive === true && game.global.preMapsActive === false) {
        ManageRepeatMaps();
        return;
    }

    setMapRunStatus("");
    if (game.global.repeatMap){
        repeatClicked();
    }
    
    var skipCheck = false;

    if (game.global.challengeActive == "Daily")
    {
        if (typeof game.global.dailyChallenge.plague !== 'undefined' || typeof game.global.dailyChallenge.bogged !== 'undefined')
            skipCheck = true;
    }
    else if (game.global.challengeActive === "Electricity" || game.global.challengeActive === "Nom" || game.global.challengeActive === "Toxicity")
        skipCheck = true;
    else if (game.global.antiStacks<25 && game.global.lastClearedCell>50)
        skipCheck = true;
    else if (game.global.lastClearedCell==-1 && game.resources.trimps.soldiers === 0)
        skipCheck = true;
        
    if (game.global.lastBreedTime<45000 && !skipCheck) return;
    if (game.global.lastClearedCell > 50 && game.global.world < trimpzSettings["voidMapsAt"].value - 5)
    {
        if (game.global.preMapsActive === true)
            RunWorld();
        return;
    }
    
    if (game.global.mapsOwnedArray.length > 90)
        recycleBelow(true);

    if (RunPrimaryUniqueMaps()) return;
    if (RunPrestigeMaps()) return;
    if (RunBetterMaps()) return;
//    if (RunUpgradeMaps()) return;
    if (game.global.preMapsActive === true) {
        RunWorld();
    }
}

function ReallocateWorkers() {
    "use strict";
    var jobObj;
    var workersToFire;
    var jobsToFire = ["Farmer", "Lumberjack", "Miner", "Scientist"];
    var job;
    var jobName;

    workersFocused = false;
    workersFocusedOn = "";
    game.global.firing = true;
    for (job in jobsToFire) {
        jobName = jobsToFire[job];
        jobObj = game.jobs[jobName];
        if (jobObj.locked === true) {
            continue;
        }
        workersToFire = Math.floor(jobObj.owned);
        game.global.buyAmt = workersToFire;
        buyJob(jobName, null, true);
    }
    game.global.buyAmt = 1;
    game.global.firing = false;
    AssignFreeWorkers();
}

function CheckLateGame() {
    "use strict";
    if (game.global.world === 60 && document.getElementById("tipTitle").innerHTML === "The Improbability")
        cancelTooltip();
    else if(game.global.world == mutations.Corruption.start(true) && document.getElementById("tipTitle").innerHTML == "Corruption")
        cancelTooltip();
    else if(game.global.spireActive && document.getElementById("tipTitle").innerHTML == "Spire")
        cancelTooltip();
    else if(mutations.Magma.active() && game.global.world == mutations.Magma.start() && document.getElementById("tipTitle").innerHTML == "The Magma")
        cancelTooltip();
        
    if (game.global.world === 1 && helium !== -1) {
        constants = constantsSets[0];
        constantsIndex = 0;
        mapsWithDesiredUniqueDrops = [8,10,14,15,18,23,25,29,30,34,40,47,50,80,125];
        heliumHistory = [];
        helium = -1;
        bionicDone = false;
        return;
    }
    if (constantsIndex === constantsSets.length - 1){ //check for last element
        return;
    }
    var nextSet = constantsIndex + 1;
    if (game.global.world >= constantsSets[nextSet].getZoneToStartAt())
    {
        constants = constantsSets[nextSet];
        constantsIndex = nextSet;
        RestoreWorkerFocus();
        ReallocateWorkers();
    }
}


function CheckHelium() {
    "use strict";
    var date;
    var oldHelium;
    var rate;
    var totalHelium;
    var totalTime;
    var cumulativeRate;
    if (helium === -1){
        helium = game.resources.helium.owned;
        heliumHistory.push({
            totalHelium: helium,
            date: Date.now(),
            heliumPerHourInZone: 0,
            totalHours: 0,
            totalHeliumPerHour: 0,
            zone: game.global.world});
    } else if (game.resources.helium.owned < helium){ //must have spent some helium
        helium = game.resources.helium.owned;
    } else if (game.resources.helium.owned > helium) {
        date = Date.now();
        oldHelium = helium;
        helium = game.resources.helium.owned;
        rate = (helium - oldHelium)/((date - heliumHistory[heliumHistory.length - 1].date)/(1000*60*60));
        totalTime = (date - game.global.portalTime)/(1000*60*60);
        totalHelium = helium;
        cumulativeRate = totalHelium / totalTime;
        heliumHistory.push({
            totalHelium: helium,
            date: date,
            heliumPerHourInZone: rate,
            totalHours: totalTime,
            totalHeliumPerHour: cumulativeRate,
            zone: game.global.world
        });
    }
}


/**
 * @return {boolean}
 */
function CheckPortal() {
    "use strict";
    var map;
    var theMap;
    var itemsAvailable;
    if (game.global.world >= trimpzSettings["portalAt"].value - 2 && !game.global.portalActive && (game.resources.trimps.soldiers === 0 || game.resources.trimps.owned === game.resources.trimps.realMax()))
    {
        if (game.global.mapsActive)
            return false;
        for (map in game.global.mapsOwnedArray){
            theMap = game.global.mapsOwnedArray[map];
            if (theMap.name !== "Dimension of Anger"){
                continue;
            }
            itemsAvailable = addSpecials(true,true,theMap);
            if (itemsAvailable > 0) {
                RunMap(theMap);
            }
        }
    } else if (game.global.world >= trimpzSettings["portalAt"].value && game.global.challengeActive !== "Electricity" && (!trimpzSettings["autoPortal"].value  || (shouldPortal && portalAtWorld == game.global.world))) {
        
        heliumLog.push(heliumHistory);
        shouldPortal = false;
        var timeSince = new Date().getTime() - beginPortalTime;
        console.log('Portal: ' + game.global.world);
//        console.log('Unused Coordination at: ' + unusedCoordsAt);
//        console.log('Warps at last Giga: ' + warpsAtLastGiga);
//        console.log('Map farming started: ' + firstVoidMap);
//        console.log('End of 100% overkill: ' + firstOverkillFail);
//        console.log('LastZoneTime: ' + prettifyTime(timeSince));
        console.log('He/h: ' + prettify(game.stats.heliumHour.value()) + "/hr");
        console.log('Time: ' + updatePortalTimer(true));
        
        unusedCoordsAt = 0;
        warpsAtLastGiga = 0;
        firstVoidMap = 0;
        firstOverkillFail = 0;

        saveSettings();
        ClickButton("portalBtn");

        switch(trimpzSettings["challenge"].value){
            case "Balance":
                ClickButton("challengeBalance");
                break;
            case "Electricity":
                ClickButton("challengeElectricity");
                break;
            case "Crushed":
                ClickButton("challengeCrushed");
                break;
            case "Nom":
                ClickButton("challengeNom");
                break;
            case "Toxicity":
                ClickButton("challengeToxicity");
                break;
            case "Watch":
                ClickButton("challengeWatch");
                break;
            case "Lead":
                ClickButton("challengeLead");
                break;
            case "Corrupted":
                ClickButton("challengeCorrupted");
                break;
            default:
                break;
        }
        ClickButton("activatePortalBtn");
//        document.getElementsByClassName("activatePortalBtn")[0].click();
        activatePortal();
        return true;
    } else if (trimpzSettings["autoPortal"].value && game.global.mapBonus==10 && game.global.formation == 2 && !ableToOneShotAllMobs(true)){
        if (!shouldPortal && (portalAtWorld != game.global.world+1))
        {
            if (portalAtWorld==game.global.world)
            {
                shouldPortal = true;
                beginPortalTime = new Date().getTime();
                console.log('Warning: Portal at next zone: ' + (portalAtWorld+1));
            }
            else console.log('Warning: Not enough damage: ' + game.global.world);
            portalAtWorld = game.global.world+1;
        }
    }
    else shouldPortal = false;
    return false;
}

function CheckFormation() {
    "use strict";
    if (game.global.world < 60)
    {
        return;
    }
    
    var oneShotMapLevel = game.portal.Overkill.level ? getLevelOfOverkillMap() : getLevelOfOneShotMap();
    
    if (game.global.world===200 && (game.global.lastClearedCell+1) >= trimpzSettings["spireDominance"].value)
        setFormation("2");
    else if (game.global.mapsActive === true && game.global.preMapsActive === false && getCurrentMapObject().location === "Void")
        setFormation("2");
    else if (game.global.formation == 4 && !(game.global.mapsActive === true && game.global.preMapsActive === false) && !ableToOverkillAllMobs())
        setFormation("2");
    else if (game.global.mapsActive === true && game.global.preMapsActive === false && oneShotMapLevel<getCurrentMapObject().level)
        setFormation("2");
    else if (game.global.formation == 2 && !(game.global.mapsActive === true && game.global.preMapsActive === false) && !ableToOverkillAllMobs(true))
        return;
    else
        setFormation("4");
}

/*function FireGeneticists() {
    "use strict";
    var global = game.global;
    if (game.jobs.Geneticist.locked !== 0 ||
        global.challengeActive === "Electricity" ||
        game.jobs.Geneticist.owned === 0) {
        return;
    }
    var targetBreedTime = trimpzSettings["targetBreedTime"].value;
    var targetBreedTimeHysteresis = trimpzSettings["targetBreedTimeHysteresis"].value;
    var trimps = game.resources.trimps;
    var remainingTimeForBreeding = getRemainingTimeForBreeding();
    while (game.jobs.Geneticist.owned !== 0 &&
    (getTotalTimeForBreeding(0) >= targetBreedTime + targetBreedTimeHysteresis ||
    remainingTimeForBreeding >= targetBreedTime + targetBreedTimeHysteresis ||
    (trimps.owned !== trimps.realMax() && remainingTimeForBreeding > 1 && game.global.soldierHealth <= game.global.soldierHealthMax * 0.5 &&
    global.lastBreedTime / 1000 > targetBreedTime - remainingTimeForBreeding + targetBreedTimeHysteresis * 1.3))) {

        global.firing = true;
        global.buyAmt = 1;
        buyJob("Geneticist", null, true);
        global.firing = false;
        remainingTimeForBreeding = getRemainingTimeForBreeding();
    }
}*/

function MaxToxicStacks() {
    "use strict";
    if (game.global.mapsActive === true && game.global.preMapsActive === false){ //no map ability(wait one) or already running a map(repeat should be off)
        return;
    }
    if(trimpzSettings["shouldMaxOutToxicityHelium"].value && game.global.challengeActive === 'Toxicity' && game.global.lastClearedCell > trimpzSettings["lastCell"].value && game.challenges.Toxicity.stacks < 1500 && game.global.world >= trimpzSettings["zoneToStartMaxingAt"].value) {
        var mapLevel = game.portal.Overkill.level ? getLevelOfOverkillMap() : getLevelOfOneShotMap();
        var theMap;
        for (var map in game.global.mapsOwnedArray) {
            theMap = game.global.mapsOwnedArray[map];
            if (theMap.level === mapLevel && theMap.loot >= 1.40 && (theMap.location === "Plentiful" || theMap.location === "Mountain")){
                RunMap(theMap);
                return;
            }
        }
        RunNewMapForLoot(mapLevel);
    }
}

function RunVoidMaps() {
    "use strict";
    if (game.global.totalVoidMaps<1) return;
    if (game.global.challengeActive == "Daily" && typeof game.global.dailyChallenge.oddTrimpNerf !== 'undefined' && ((game.global.world % 2) == 1)) return;//no voids on nerfed odd zones
/*    if (game.global.mapsActive === true && game.global.preMapsActive === false){ //no map ability(wait one) or already running a map(repeat should be off)
        if (getCurrentMapObject().location == "Void")
        {
//            if (game.global.lastClearedMapCell <=5 && game.global.antiStacks<30 && game.global.lastBreedTime>=45000) goto run_map;
            if (ableToRunVoidMap(game.global.world+1) === true)
                game.options.menu.repeatVoids.enabled = 0;
            else
                game.options.menu.repeatVoids.enabled = 1;
            toggleSetting("repeatVoids", null, false, true);
        }
        return;
    }*/
//    if (game.global.lastClearedCell > trimpzSettings["lastCell"].value && game.global.lastBreedTime>=45000 || game.global.lastClearedCell > 96) {
//        if (ableToRunVoidMap(game.global.world+1) === false && ableToRunVoidMap(game.global.world-2) === true && game.global.world%10<5 && game.global.world%10>0 || (shouldPortal && portalAtWorld == game.global.world))
    if (trimpzSettings["voidMapsAt"].value <= game.global.world &&/* ableToRunVoidMap(game.global.world+1) === false &&*/
        game.global.lastClearedCell > trimpzSettings["lastCell"].value && (game.global.lastBreedTime>=45000 || game.global.lastClearedCell > 96))
    {
        var theMap;
        for (var map in game.global.mapsOwnedArray) {
            theMap = game.global.mapsOwnedArray[map];
            if (theMap.location == 'Void'){
                if (firstVoidMap == 0) firstVoidMap = game.global.world;
                RunMap(theMap);
                return;
            }
        }
    }
}

function ableToRunVoidMap(world)
{
    var enemyHealth = getAverageEnemyHealthForLevel(world, false, true);
    var soldierAttack = getSoldierCritAttack(game.global.world, true);
    
    if (game.unlocks.imps.Titimp) soldierAttack *= 2;

    if (game.talents.voidPower.purchased){
		soldierAttack *= (game.talents.voidPower2.purchased) ? 1.35 : 1.15;
	}
	if (canAffordCoordinationTrimps()) soldierAttack *= 1.25;
	soldierAttack -= enemyHealth;
    if (soldierAttack < 1) return false;
    if (soldierAttack * game.portal.Overkill.level * 0.005 >= enemyHealth) return true;
        
    return false;
}

function TurnOffIncompatibleSettings() {
    //if (game.global.repeatMap)
    //    repeatClicked();
    game.global.addonUser = true;
    if (game.options.menu.confirmhole.enabled)
        toggleSetting("confirmhole");
    if (game.global.autoUpgrades)
        toggleAutoUpgrades();
    if (game.options.menu.exitTo.enabled == 0)
    {
        game.options.menu.exitTo.enabled = 1;
        toggleSetting("exitTo", null, false, true);
    }
    if (!game.global.pauseFight) pauseFight();
}

function FocusOnBreeding(){
/*    var targetBreedTime = trimpzSettings["targetBreedTime"].value;
    var hysteresis = trimpzSettings["targetBreedTimeHysteresis"].value;
    if(game.global.lastBreedTime / 1000 > targetBreedTime - getRemainingTimeForBreeding() + hysteresis &&
        game.jobs.Geneticist.owned < 10 ||
        game.resources.trimps.soldiers === 0){
        clearQueue("Warpstation");
    }*/
    if (game.global.world > 10 && game.resources.trimps.soldiers === 0 && getRemainingTimeForBreeding() > 1){
//        fightManual();
        if (!game.global.mapsActive)
            ReallocateWorkers();
    }
}

//Start
(function () {
    "use strict";
    CreateButtonForPausing();
    initializeUiAndSettings();
    var i;
    for(i = 0; i < constantsSets.length; ++i){
        if (game.global.world >= constantsSets[i].getZoneToStartAt()) {
            constants = constantsSets[i];
            constantsIndex = i;
        }
    }
    setTimeout(MainLoopRunner, 100);
})();

function MainLoopRunner(){
    "use strict";
    if (typeof enteringValue != 'undefined')
        MainLoop();
    setTimeout(MainLoopRunner, constants.getRunInterval());
}

function MainLoop(){
    "use strict";
    if (pauseTrimpz === true){
        return;
    }
    ShowRunningIndicator();
    TurnOffIncompatibleSettings();
    CheckLateGame();
    CheckHelium();
    autoHeirlooms(); //directly from AT
    if (CheckPortal() === true){
        return;
    }
    BuyGoldenUpgrade();
+   Shriek();
    AssignFreeWorkers();
    ManageGenerator();
//    UpgradeStorage();
    MaxToxicStacks();
    RunVoidMaps();
    ClickAllNonEquipmentUpgrades();
/*    var shouldReturn = BeginPriorityAction();
    if (shouldReturn === true) {
        return;
    }*/
    var collectingForUpgrade = UpgradeAndGather();
//    FireGeneticists();
    if (collectingForUpgrade === false) { //allow resources to accumulate for upgrades if true
        BuyMetalEquipment();
        BuyBuildings();
        BuyShield();
    }
    FocusOnBreeding();
    CheckFormation();
    RunMaps();
    Fight();
}

function CreateButtonForPausing() {
    "use strict";
    var addElementsHere = document.getElementById("battleBtnsColumn");
    var newDiv = document.createElement("DIV");
    newDiv.className = "battleSideBtnContainer";
    addElementsHere.appendChild(newDiv);

    var newSpan = document.createElement("SPAN");
    newSpan.id = "pauseTrimpzBtn";
    newSpan.className = "btn btn-primary fightBtn";
    newSpan.setAttribute("style", "white-space:normal");
    pauseTrimpz = false;
    newSpan.innerHTML = "Running";
    newSpan.onclick = function () {
        pauseTrimpz = ! pauseTrimpz;
        if (pauseTrimpz === true){
            newSpan.innerHTML = "Paused";
        } else{
            newSpan.innerHTML = "Running";
        }
    };
    newDiv.appendChild(newSpan);
    return newSpan;
}

//Thank you to Autotrimps/spindrjr for all your hard work on this.
//I've copied this to keep users of Trimpz, including myself, from losing precious lootz since I had no idea this update was coming.
//I may or may not keep any of this code in here once I have a chance to look over everything and think about how I'd like it implemented,
//but until then big thanks again to AT/spindrjr.
var worth = {'Shield': {}, 'Staff': {}};
function sortHeirlooms(){
    worth = {'Shield': {}, 'Staff': {}};
    for (var loom in game.global.heirloomsExtra) {
        var theLoom = game.global.heirloomsExtra[loom];
        worth[theLoom.type][loom] = theLoom.rarity;
    }

    //sort high to low value, priority on rarity, followed by mod evaluation
    for (var x in worth){
        worth[x] = Object.keys(worth[x]).sort(function(a, b) {
            if(worth[x][b] == worth[x][a]) {
                return evaluateMods(b, 'heirloomsExtra') - evaluateMods(a, 'heirloomsExtra');
            }
            else
                return worth[x][b] - worth[x][a];
        });
    }
    // console.log(worth);
    //console.log('hat: ' + worth['Shield']);
    //console.log('staff: ' + worth['Staff']);
}

//polyfill for includes function
if (!String.prototype.includes) {
    String.prototype.includes = function(search, start) {
        'use strict';
        if (typeof start !== 'number') {
            start = 0;
        }

        if (start + search.length > this.length) {
            return false;
        } else {
            return this.indexOf(search, start) !== -1;
        }
    };
}

function autoHeirlooms() {
    var bestUpgrade;
    if (!trimpzSettings["AutoHeirlooms"].value){
        return;
    }
    if(!heirloomsShown && game.global.heirloomsExtra.length > 0){
        sortHeirlooms();
        for(var carried in game.global.heirloomsCarried) {
            var theLoom = game.global.heirloomsCarried[carried];
            if(worth[theLoom.type].length == 0) continue;
            var index = worth[theLoom.type][0];
            if(theLoom.rarity < game.global.heirloomsExtra[index].rarity || (theLoom.rarity == game.global.heirloomsExtra[index].rarity && evaluateMods(carried, 'heirloomsCarried') < evaluateMods(index, 'heirloomsExtra'))) {
                selectHeirloom(carried, 'heirloomsCarried');
                stopCarryHeirloom();
                selectHeirloom(index, 'heirloomsExtra');
                carryHeirloom();
                sortHeirlooms();
            }
        }
        if(game.global.heirloomsCarried.length < game.global.maxCarriedHeirlooms) {
            if(worth.Shield.length > 0)
                selectHeirloom(worth.Shield[0], 'heirloomsExtra');
            else if(worth.Staff.length > 0)
                selectHeirloom(worth.Staff[0], 'heirloomsExtra');
            carryHeirloom();
        }
    }
    else if(heirloomsShown && game.global.selectedHeirloom.length > 0){
        if(game.global.selectedHeirloom[1].includes('Equipped')) {
            var loom = game.global[game.global.selectedHeirloom[1]];
            bestUpgrade = evaluateMods(0, game.global.selectedHeirloom[1], true);
            if(bestUpgrade.index) {
                bestUpgrade.effect *= getModUpgradeCost(loom, bestUpgrade.index);
                bestUpgrade.effect = bestUpgrade.effect.toFixed(6);
                var styleIndex = 4 + (bestUpgrade.index * 3);
                //enclose in backtic ` for template string $ stuff
                document.getElementById('selectedHeirloom').childNodes[0].childNodes[styleIndex].style.backgroundColor = "lightblue";
                document.getElementById('selectedHeirloom').childNodes[0].childNodes[styleIndex].setAttribute("onmouseover", `tooltip(\'Heirloom\', \"customText\", event, \'<div class=\"selectedHeirloomItem heirloomRare${loom.rarity}\"> AutoTrimps recommended upgrade for this item. </div>\'         )`);
                document.getElementById('selectedHeirloom').childNodes[0].childNodes[styleIndex].setAttribute("onmouseout", 'tooltip(\'hide\')');
                //lightblue = greyish
                //swapClass("tooltipExtra", "tooltipExtraHeirloom", document.getElementById("tooltipDiv"));
                //document.getElementById("tooltipDiv");
            }
        }
    }
    //heirloomsShown
    //getModReplaceCost(heirloomObj, modIndex)
    //getModUpgradeCost(heirloomObj, modIndex)
    //document.getElementById('extraHeirloomsHere').childNodes[INDEX].childNodes[1].style.border = "1px solid #00CC00"
    //document.getElementById('selectedHeirloom').childNodes[0].childNodes[4/7/10/13].style.backgroundColor
    //advBtn.setAttribute("onmouseover", 'tooltip(\"Advanced Settings\", \"customText\", event, \"Leave off unless you know what you\'re doing with them.\")');
}

function evaluateMods(loom, location, upgrade) {
    var index = loom;
    var bestUpgrade = {
        'index': null,
        'name': '',
        'effect': 0
    };
    var tempEff;
    var steps;
    if(location.includes('Equipped'))
        loom = game.global[location];
    else
        loom = game.global[location][loom];
//	return loom.rarity;
    var eff = 0;
    for(var m in loom.mods) {
        switch(loom.mods[m][0]) {
            case 'critChance':
                tempEff = ((loom.mods[m][1]/100) * (getPlayerCritDamageMult() - game.heirlooms.Shield.critDamage.currentBonus/100))/((getPlayerCritChance() - game.heirlooms.Shield.critChance.currentBonus/100) * (getPlayerCritDamageMult() - game.heirlooms.Shield.critDamage.currentBonus/100) + 1 - (getPlayerCritChance() - game.heirlooms.Shield.critChance.currentBonus/100));
                eff += tempEff;
                if(upgrade){
                    if(loom.mods[m][1] >= 30) break;
                    steps = game.heirlooms.Shield.critChance.steps[loom.rarity];
                    tempEff = (steps[2]/100 * getPlayerCritDamageMult())/((getPlayerCritChance() * getPlayerCritDamageMult()) + 1 - getPlayerCritChance());
                    tempEff = tempEff / getModUpgradeCost(loom, m);
                    if(tempEff > bestUpgrade.effect) {
                        bestUpgrade.effect = tempEff;
                        bestUpgrade.name = 'critChance';
                        bestUpgrade.index = m;
                    }
                }
                break;
            case 'critDamage':
                tempEff = ((loom.mods[m][1]/100) * (getPlayerCritChance() - game.heirlooms.Shield.critChance.currentBonus/100))/((getPlayerCritDamageMult() - game.heirlooms.Shield.critDamage.currentBonus/100) * (getPlayerCritChance() - game.heirlooms.Shield.critChance.currentBonus/100) + 1 - (getPlayerCritChance() - game.heirlooms.Shield.critChance.currentBonus/100));
                eff += tempEff;
                if(upgrade){
                    steps = game.heirlooms.Shield.critDamage.steps[loom.rarity];
                    tempEff = (getPlayerCritChance() * (steps[2]/100))/((getPlayerCritDamageMult() * getPlayerCritChance()) + 1 - getPlayerCritChance());
                    tempEff = tempEff / getModUpgradeCost(loom, m);
                    if(tempEff > bestUpgrade.effect) {
                        bestUpgrade.effect = tempEff;
                        bestUpgrade.name = 'critDamage';
                        bestUpgrade.index = m;
                    }
                }
                break;
            case 'trimpAttack':
                tempEff = loom.mods[m][1]/100;
                eff += tempEff;
                if(upgrade){
                    steps = game.heirlooms.Shield.trimpAttack.steps[loom.rarity];
                    tempEff = (steps[2]/100)/((game.heirlooms.Shield.trimpAttack.currentBonus/100) + 1);
                    tempEff = tempEff / getModUpgradeCost(loom, m);
                    if(tempEff > bestUpgrade.effect) {
                        bestUpgrade.effect = tempEff;
                        bestUpgrade.name = 'trimpAttack';
                        bestUpgrade.index = m;
                    }
                }
                break;
            case 'voidMaps':
                tempEff = loom.mods[m][1]/100;
                eff += tempEff;
                if(upgrade){
                    steps = game.heirlooms.Shield.voidMaps.steps[loom.rarity];
                    tempEff = (steps[2]/100)/((game.heirlooms.Shield.voidMaps.currentBonus/100) + 1);
                    tempEff = tempEff / getModUpgradeCost(loom, m);
                    if(tempEff > bestUpgrade.effect) {
                        bestUpgrade.effect = tempEff;
                        bestUpgrade.name = 'voidMaps';
                        bestUpgrade.index = m;
                    }
                }
                break;
            case 'MinerSpeed':
                tempEff = 0.75*loom.mods[m][1]/100;
                eff += tempEff;
                if(upgrade) {
                    steps = game.heirlooms.defaultSteps[loom.rarity];
                    tempEff = (0.75*steps[2]/100)/((game.heirlooms.Staff.MinerSpeed.currentBonus/100) + 1);
                    tempEff = tempEff / getModUpgradeCost(loom, m);
                    if(tempEff > bestUpgrade.effect) {
                        bestUpgrade.effect = tempEff;
                        bestUpgrade.name = 'MinerSpeed';
                        bestUpgrade.index = m;
                    }
                }
                break;
            case 'metalDrop':
                tempEff = 0.75*loom.mods[m][1]/100;
                eff += tempEff;
                if(upgrade) {
                    steps = game.heirlooms.defaultSteps[loom.rarity];
                    tempEff = (0.75*steps[2]/100)/((game.heirlooms.Staff.metalDrop.currentBonus/100) + 1);
                    tempEff = tempEff / getModUpgradeCost(loom, m);
                    if(tempEff > bestUpgrade.effect) {
                        bestUpgrade.effect = tempEff;
                        bestUpgrade.name = 'metalDrop';
                        bestUpgrade.index = m;
                    }
                }
                break;
            case 'FarmerSpeed':
                tempEff = 0.5*loom.mods[m][1]/100;
                eff += tempEff;
                if(upgrade) {
                    steps = game.heirlooms.defaultSteps[loom.rarity];
                    tempEff = (0.5*steps[2]/100)/((game.heirlooms.Staff.FarmerSpeed.currentBonus/100) + 1);
                    tempEff = tempEff / getModUpgradeCost(loom, m);
                    if(tempEff > bestUpgrade.effect) {
                        bestUpgrade.effect = tempEff;
                        bestUpgrade.name = 'FarmerSpeed';
                        bestUpgrade.index = m;
                    }
                }
                break;
            case 'LumberjackSpeed':
                tempEff = 0.5*loom.mods[m][1]/100;
                eff += tempEff;
                if(upgrade) {
                    steps = game.heirlooms.defaultSteps[loom.rarity];
                    tempEff = (0.5*steps[2]/100)/((game.heirlooms.Staff.LumberjackSpeed.currentBonus/100) + 1);
                    tempEff = tempEff / getModUpgradeCost(loom, m);
                    if(tempEff > bestUpgrade.effect) {
                        bestUpgrade.effect = tempEff;
                        bestUpgrade.name = 'LumberjackSpeed';
                        bestUpgrade.index = m;
                    }
                }
                break;
            case 'DragimpSpeed':
                tempEff = 0.5*loom.mods[m][1]/100;
                eff += tempEff;
                if(upgrade) {
                    steps = game.heirlooms.defaultSteps[loom.rarity];
                    tempEff = (0.5*steps[2]/100)/((game.heirlooms.Staff.DragimpSpeed.currentBonus/100) + 1);
                    tempEff = tempEff / getModUpgradeCost(loom, m);
                    if(tempEff > bestUpgrade.effect) {
                        bestUpgrade.effect = tempEff;
                        bestUpgrade.name = 'DragimpSpeed';
                        bestUpgrade.index = m;
                    }
                }
                break;
            case 'empty':
                var av;
                //some other function?
                if(upgrade) break;
                //value empty mod as the average of the best mod it doesn't have. If it has all good mods, empty slot has no value
                if(loom.type == 'Shield') {
                    if(!checkForMod('trimpAttack', index, location)){
                        steps = game.heirlooms.Shield.trimpAttack.steps[loom.rarity];
                        av = steps[0] + ((steps[1] - steps[0])/2);
                        tempEff = av/100;
                        eff += tempEff;
                    }
                    else if(!checkForMod('voidMaps', index, location)){
                        steps = game.heirlooms.Shield.voidMaps.steps[loom.rarity];
                        av = steps[0] + ((steps[1] - steps[0])/2);
                        tempEff = (steps[2]/100);
                        eff += tempEff;
                    }
                    else if(!checkForMod('critChance', index, location)){
                        steps = game.heirlooms.Shield.critChance.steps[loom.rarity];
                        av = steps[0] + ((steps[1] - steps[0])/2);
                        tempEff = (av * (getPlayerCritDamageMult() - game.heirlooms.Shield.critDamage.currentBonus/100))/((getPlayerCritChance() - game.heirlooms.Shield.critChance.currentBonus/100) * (getPlayerCritDamageMult() - game.heirlooms.Shield.critDamage.currentBonus/100) + 1 - (getPlayerCritChance() - game.heirlooms.Shield.critChance.currentBonus/100));
                        eff += tempEff;
                    }
                    else if(!checkForMod('critDamage', index, location)){
                        steps = game.heirlooms.Shield.critDamage.steps[loom.rarity];
                        av = steps[0] + ((steps[1] - steps[0])/2);
                        tempEff = (av * (getPlayerCritChance() - game.heirlooms.Shield.critChance.currentBonus/100))/((getPlayerCritDamageMult() - game.heirlooms.Shield.critDamage.currentBonus/100) * (getPlayerCritChance() - game.heirlooms.Shield.critChance.currentBonus/100) + 1 - (getPlayerCritChance() - game.heirlooms.Shield.critChance.currentBonus/100));
                        eff += tempEff;
                    }
                }
                if(loom.type == 'Staff') {
                    steps = game.heirlooms.defaultSteps[loom.rarity];
                    av = steps[0] + ((steps[1] - steps[0])/2);
                    if(!checkForMod('MinerSpeed', index, location) || !checkForMod('metalDrop', index, location)){
                        eff += 0.75*av/100;
                    }
                    else if(!checkForMod('LumberjackSpeed', index, location) || !checkForMod('FarmerSpeed', index, location) || !checkForMod('DragimpSpeed', index, location)){
                        eff += 0.5*av/100;
                    }
                }
                break;
            //metalDrop? trimpHealth?
        }
    }
    if(upgrade) return bestUpgrade;
    return eff;
}

function checkForMod(what, loom, location){
    var heirloom = game.global[location][loom];
    for (var mod in heirloom.mods){
        if (heirloom.mods[mod][0] == what) return true;
    }
    return false;
}

function Shriek() {
    //exit if the cooldown is active, or we havent unlocked robotrimp.
    if (game.global.roboTrimpCooldown > 0 || !game.global.roboTrimpLevel) return;
    //activate the button when we are above the cutoff zone, and we are out of cooldown (and the button is inactive)
    if (game.global.world >= 200 && game.global.world % 5 == 0 && !game.global.useShriek){
        magnetoShriek();
    }
}

function BuyGoldenUpgrade()
{
    if (getAvailableGoldenUpgrades() == 0) return;       //if we have nothing to buy, exit.
    //buy one upgrade per loop.
    if (game.global.runningChallengeSquared)
    {
        buyGoldenUpgrade("Battle");
        return;
    }
    
    var nextAmt = game.goldenUpgrades.Void.nextAmt();
    if (nextAmt <= 0.02)
        buyGoldenUpgrade("Void");
    else
        buyGoldenUpgrade(trimpzSettings["goldenUpgrade"].value);
}

function ableToOverkillAllMobs(scryer)
{
    var enemyHealth = getAverageEnemyHealthForLevel(game.global.world, false, false);
    var soldierAttack = getSoldierAttack(game.global.world, false);

    if (game.global.formation == 4 && !(game.global.mapsActive === true && game.global.preMapsActive === false)) soldierAttack/=8;
    if (scryer) soldierAttack/=8;

	soldierAttack -= enemyHealth;
    if (soldierAttack < 1) return false;
    if (soldierAttack * game.portal.Overkill.level * 0.005 >= enemyHealth) return true;
        
    return false;
}

function ableToGetChronoUpgrade()
{
    var chronoImpLoot;
    var eqCost;
    
    if (game.global.totalVoidMaps<4) return false;
    
    if (game.unlocks.imps.Chronoimp)
    {
        chronoImpLoot = getChronoImpLoot('metal');
        eqCost = FindAndBuyEquipment("Attack", true);
        
        if (game.resources['metal'].owned>eqCost) return false;
        
        if (game.resources['metal'].owned+chronoImpLoot>eqCost*1.1) return true;
    }
    return false;
}

function getChronoImpLoot(resource)
{
    var chronoImpLoot;
    
    chronoImpLoot = simpleSeconds(resource, 5);
	chronoImpLoot = Math.round(chronoImpLoot * 1.85);
	if (game.unlocks.impCount.Magnimp) chronoImpLoot *= Math.pow(1.003, game.unlocks.impCount.Magnimp);
	if (game.portal.Looting.level) chronoImpLoot += (chronoImpLoot * game.portal.Looting.level * game.portal.Looting.modifier);
	if (game.portal.Looting_II.level) chronoImpLoot *= (1 + (game.portal.Looting_II.level * game.portal.Looting_II.modifier));
	/*if (game.global.formation == 4)*/ chronoImpLoot *= 2;
	
	return chronoImpLoot;
}

function ableToOneShotAllMobs(portal)
{
    var enemyHealth = getAverageEnemyHealthForLevel(game.global.world, false, false);
    var soldierAttack = getSoldierCritAttack(game.global.world, true);

    if (game.global.formation == 4 && !(game.global.mapsActive === true && game.global.preMapsActive === false)) soldierAttack/=8;
    
    if (game.global.mapsActive === true && game.global.preMapsActive === false)
        soldierAttack *= (1 + (0.2 * (game.global.mapBonus + 1)));
    else
        soldierAttack *= (1 + (0.2 * game.global.mapBonus));
        
    if (getEmpowerment() == "Poison")
        soldierAttack += Math.ceil(game.empowerments.Poison.getModifier() * getSoldierAttack(game.global.world, true));

    if (portal) soldierAttack *= 2.2;

    return soldierAttack>enemyHealth;
}

function reallyNeedLoot()
{
    return false;
//    var attacksToDie = canTakeOnBoss();
//    return attacksToDie.attacksToKillSoldiers < trimpzSettings["minAttackstoDie"].value/2;
}

function prettifyTime(timeSince)
{
    timeSince /= 1000;
	var days = Math.floor(timeSince / 86400);
	var hours = Math.floor( timeSince / 3600) % 24;
	var minutes = Math.floor(timeSince / 60) % 60;
	var seconds = Math.floor(timeSince % 60);
	var timeArray = [days, hours, minutes, seconds];
	var timeString = "";
	for (var x = 0; x < 4; x++){
		var thisTime = timeArray[x];
		thisTime = thisTime.toString();
		timeString += (thisTime.length < 2) ? "0" + thisTime : thisTime;
		if (x != 3) timeString += ":";
	}
    return timeString;
}

function ManageGenerator()
{
    if (game.global.world<230) return;
    if (game.global.world>trimpzSettings["voidMapsAt"].value)
        changeGeneratorState(0);
    else if (game.global.world<trimpzSettings["voidMapsAt"].value - 2 && game.global.magmaFuel>game.generatorUpgrades.Capacity.modifier)
        changeGeneratorState(0);
    else
        changeGeneratorState(2);
}

