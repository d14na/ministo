/*
In order to test basic GPU mining functions

Compile the C++ addon with
>>>> npm run build (this calls binding.gyp)

Run this file with
>>>> node indextestgpu.js

CURRENT ISSUE :
undefined symbol: device_map

this is in miner.h : ?
extern short device_map[MAX_GPUS];

this is in cuda_helper ?
extern "C" short device_map[MAX_GPUS];

https://github.com/tpruvot/ccminer/search?p=1&q=device_map&type=&utf8=%E2%9C%93  ?
*/

const web3utils = require('web3-utils')

// import C++ GPU miner code --  /cpp/gpuminer.cc
const GPUMiner = require('../build/Release/gpuminer_addon')

const testNonce = 5566
const target = 5841053340
const challenge = 2000
const ethAddress = '0x1234'

// send data into the miner
console.log('Difficulty Target', GPUMiner.setTarget(target))
console.log('Challenge Number', GPUMiner.setChallenge(challenge))
console.log('ETH Address', GPUMiner.setEthAddress(ethAddress))
console.log('Random Number', GPUMiner.getRandomNumber())

console.log(
    'keccak hash should be',
    web3utils.soliditySha3(testNonce, ethAddress, challenge),
    GPUMiner.getKeccak256(testNonce, ethAddress, challenge)
)

console.log('hashtest ', GPUMiner.testHashFunction(12345))
// start the infinite mining loop which is in c++

const _solutions = function () {
    console.log('asking GPU process for solutions...')

    let gpuSolutions = GPUMiner.getSolutionsBuffer()

    console.log(gpuSolutions)

    GPUMiner.clearSolutionsBuffer()
}

setInterval(_solutions, 2000)

const _startMining = function () {
    const response = GPUMiner.startMining()

    console.log(response)
}

setTimeout(_startMining, 0)

/*
This code will eventually be moved into the file 'tokenminer-boost.js'
*/
