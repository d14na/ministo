<template>
    <v-layout row>
        <v-flex>
            <v-card height="100vh">
                <v-card-title class="blue white--text elevation-3">
                    <span class="headline">
                        Ministo
                        <small><em><small>v{{version}}</small></em></small>
                    </span>

                    <v-spacer></v-spacer>

                    <!-- <v-menu bottom left>
                        <template v-slot:activator="{ on }">
                            <v-btn
                                dark
                                icon
                                v-on="on"
                            >
                                <v-icon>fa-ellipsis-v</v-icon>
                            </v-btn>
                        </template>

                        <v-list>
                            <v-list-tile
                                v-for="(item, i) in menuItems"
                                :key="i"
                                @click="menuSelect(i)"
                            >
                                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                            </v-list-tile>
                        </v-list>
                    </v-menu> -->
                </v-card-title>

                <v-card-text>
                    <h3>
                        Ready to start Token Mining? Let's GO!
                    </h3>

                    <p class="mt-3">
                        Open your web browser to:
                        <br /><strong>https://minado.network/#/{{ministoTag}}</strong>
                        <v-icon
                            small
                            class="ml-2 red--text"
                            @click="open('https://minado.network/#/' + ministoTag)"
                        >
                            fa-external-link-alt
                        </v-icon>
                    </p>

                    <v-alert
                        :value="true"
                        type="info"
                        color="light-blue"
                        class="elevation-1 mt-4"
                        outline
                    >
                        <h3>THIS IS YOUR MINISTO TAG</h3>
                    </v-alert>

                    <h1 class="text-xs-center mt-2 ministoTag">{{ministoTag}}</h1>

                    <v-alert
                        :value="true"
                        type="info"
                        color="light-blue"
                        class="elevation-1 mt-3"
                        outline
                    >
                        <h3>CURRENT MINISTO STATUS</h3>
                    </v-alert>

                    <div class="system-status mt-2">
                        <div class="left-side">
                            <ul>
                                <li>Windows 10</li>
                                <li>8GB Ram</li>
                                <li>FAST Connectivity</li>
                            </ul>
                        </div>

                        <div class="right-side">
                            <div>
                                Hash Rate: <span class="red--text">{{hashRate}}</span>
                            </div>

                            <div>
                                # Hashes: {{numHashes}}
                            </div>

                            <div>
                                # Shares: <span class="red--text">{{numShares}}</span>
                            </div>
                        </div>
                    </div>

                    <div class="activity-graph elevation-1">
                        [ SHOW REAL-TIME ACTIVITY GRAPH HERE ]
                    </div>
                </v-card-text>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
import {
    mapActions,
    mapGetters
} from 'vuex'

/* Import libraries. */
import numeral from 'numeral'
import Store from 'electron-store'
import SockJS from 'sockjs-client'

/* Require modules. */
const ipc = require('electron').ipcRenderer
const web3Utils = require('web3-utils')

/* Initialize new (persistent) store. */
const store = new Store()

/* Import package.json. */
const pjson = require('../../../package.json')

/* Initialize CPU miner. */
const CPUMiner = require('../../../build/Release/cpuminer')

/* Initialize Minado.Network endpoint. */
// const MINADO_NETWORK_URL = 'ws://asia.minado.network'
const MINADO_NETWORK_URL = 'http://asia.minado.network'

/* Initailize constants. */
const PRINT_STATS_TIMEOUT = 5000

let GPUMiner = null // eslint-disable-line no-unused-vars

export default {
    data: () => ({
        ws: null, // WebSocket

        isMining: false,
        minadoAddress: '',
        minadoChallenge: '',
        minadoDifficulty: '',
        minadoTarget: '',

        numHashes: '',
        numShares: '',
        hashRate: '',

        avatarSize: 64,
        ministoTag: '',
        showGaia: false,
        pingTimeout: null,

        version: '',
        menuItems: [
            { title: 'Compact View' },
            { title: 'Exit' }
        ]
    }),
    computed: {
        ...mapGetters([
            'account',
            'email'
        ]),
        challengeDisplay () {
            if (this.minadoChallenge) {
                return this.minadoChallenge
            } else {
                return 'n/a'
            }
        },
        emailAddress () {
            return this.email
            // return this.$store.state.Profile.email
        }
    },
    methods: {
        ...mapActions([
            'clearEmail',
            'updateEmail'
        ]),
        async init () {
            /* Set version. */
            this.version = pjson.version

            /* Get/validate ministo tag. */
            this.getTag()

            this.ws = new SockJS(MINADO_NETWORK_URL)
            // console.log('this.ws', this.ws)

            this.ws.onopen = () => {
                console.log('open')

                /* Build package. */
                const pkg = {
                    client: 'ministo',
                    tag: this.ministoTag,
                    version: this.version
                }

                this.ws.send(JSON.stringify(pkg))
            }

            this.ws.onmessage = (_e) => {
                console.log('Incoming message:', _e.data)

                let data = null

                try {
                    data = JSON.parse(_e.data)
                } catch (_e) {
                    console.error(_e)
                }

                if (data && data.action) {
                    const action = data.action

                    console.log('RECEIVED ACTION:', action)

                    if (action === 'config') {
                        this.minadoAddress = data.address
                        this.minadoChallenge = data.challenge
                        this.minadoDifficulty = data.difficulty
                        this.minadoTarget = data.target
                    }

                    if (action === 'start_mining') {
                        this.mine()
                    }

                    if (action === 'stop_mining') {
                        CPUMiner.stop()
                    }
                }
            }

            this.ws.onclose = () => {
                console.log('Connection closed.')
            }

            /* Initialize CPU Miner listener. */
            ipc.on('startMining', (_event, _arg) => {
                this.mine()
            })

            /* Initialize hash update listener. */
            ipc.on('updateNumHashes', (_event, _arg) => {
                this.numHashes = _arg
                ipc.send('_debug', `this.numHashes [ ${this.numHashes} ]`)
            })

            /* Initialize hash update listener. */
            ipc.on('updateHashRate', (_event, _arg) => {
                this.hashRate = _arg
                ipc.send('_debug', `this.hashRate [ ${this.hashRate} ]`)
            })

            /* Set an interval to update mining stats. */
            setInterval(
                () => { this.printMiningStats() }, PRINT_STATS_TIMEOUT
            )

            /**
             * Token Miner Boost
             */

            /* Validate Nvidia CUDA support. */
            // if (this.useCUDA) {
            //     GPUMiner = require('../build/Release/gpuminer')
            // }

            /* Handle (process) exit. */
            process.on('exit', () => {
                console.log('Process exiting... stopping miner')

                /* Stop the CPU miner. */
                CPUMiner.stop()
            })
        },
        getTag () {
            /* Retrieve tag from storage. */
            let tag = store.get('settings.tag')

            /* Validate tag. */
            if (!tag || tag.length !== 10) {
                /* Generate ministo tag. */
                tag = this.makeId(10)

                /* Save tag to store. */
                store.set('settings.tag', tag)
            }

            ipc.send('_debug', `Ministo Id [ ${tag} ]`)

            /* Update instance. */
            this.ministoTag = tag

            /* Return tag. */
            return tag
        },
        menuSelect (_option) {
            switch (_option) {
            case 0:
                // TODO Add minimized UI switching
                this.mine()

                break
            case 1:
                ipc.send('cmd', 'quit')

                break
            }
        },
        resetEmail () {
            this.updateEmail('satoshi@nakamoto.gov - ' + Date.now())
            // this.$store.dispatch(
            //     'updateEmail', 'satoshi@nakamoto.gov - ' + Date.now())
        },
        open (link) {
            this.$electron.shell.openExternal(link)
        },
        toggleGaia () {
            console.log('Toggle Gaia')

            this.showGaia = !this.showGaia
        },
        makeId (_length) {
            let text = ''

            const possible = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz' // base56

            for (let i = 0; i < _length; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length))
            }

            return text
        },
        updateCPUMiner () {
            // ipc.send('_debug', `updateCPUMiner - ${this.minadoAddress} | ${this.minadoChallenge} | ${this.minadoTarget}`)

            /* Set mint address. */
            CPUMiner.setMinerAddress(this.minadoAddress)

            /* Set challenge number. */
            CPUMiner.setChallengeNumber(this.minadoChallenge)

            /* Set target. */
            CPUMiner.setDifficultyTarget(this.minadoTarget)
        },

        /**
         * Token Miner Boost
         */
        mine () {
            ipc.send('_debug', `Ministo has started mining..`)

            // ipc.send('_debug', `TARGET [ ${this.minadoTarget} ]`)
            // ipc.send('_debug', `DIFFICULTY [ ${this.minadoDifficulty} ]`)

            const _verifyAndSubmit = (_solution) => {
                // ipc.send('_debug', `SOLUTION NUMBER [ ${_solution} ]`)

                /* Build digest hash. */
                const digest = web3Utils.soliditySha3(
                    this.minadoChallenge,
                    this.minadoAddress,
                    _solution
                )

                // ipc.send('_debug', `DIGEST [ ${digest} ]`)

                const digestBN = web3Utils.toBN(digest)
                const targetBN = web3Utils.toBN(this.minadoTarget)

                // ipc.send('_debug', `DIGEST BIGNUMBER [ ${digestBN} ]`)
                // ipc.send('_debug', `MINADO TARGET BN [ ${targetBN} ]`)

                if (digestBN.lte(targetBN)) {
                    ipc.send('_debug', `Submit mined solution [ ${_solution} ] for challenge [ ${this.minadoChallenge} ] with digest [ ${digest} ]`)

                    /* Build package. */
                    const pkg = {
                        client: 'ministo',
                        tag: this.ministoTag,
                        version: this.version,
                        token: '0xf6E9Fc9eB4C20eaE63Cb2d7675F4dD48B008C531', // ZeroGold
                        solution: _solution,
                        digest,
                        challenge: this.minadoChallenge,
                        difficulty: this.minadoDifficulty
                    }

                    this.ws.send(JSON.stringify(pkg))
                } else {
                    ipc.send('_debug', `
    Verification Failed!
    --------------------

        Challenge : ${this.minadoChallenge}
        Address   : ${this.minadoAddress}
        Solution  : ${_solution}
        Digest    : ${digestBN}
        Target    : ${this.minadoTarget}
                    `)
                }
            } // verifyAndSubmit

            /* Set flag. */
            this.isMining = true

            CPUMiner.stop()

            /* Update the CPU miner's parameters. */
            this.updateCPUMiner()

            // ipc.send('_debug', `START MINING for [ ${this.minadoAddress} ]`)

            CPUMiner.run((err, sol) => {
                if (err) {
                    ipc.send('_debug', `ERROR: Failed to run 'CPUMiner'. [ ${err} ]`)
                }

                if (sol) {
                    _verifyAndSubmit(sol)
                }

                /* Set flag. */
                this.isMining = false
            })
        },
        printMiningStats () {
            /* Set hashes. */
            const hashes = CPUMiner.hashes()

            /* Calucate hashrate. */
            const rate = hashes / PRINT_STATS_TIMEOUT / 1000

            ipc.send('numHashes', numeral(hashes).format('0,0'))

            ipc.send('hashRate', `${numeral(rate).format('0,0.00')} MH/s`)
        }
    },
    mounted: async function () {
        /* Initialize. */
        this.init()
    }
}
</script>

<style lang="scss">
.system-status {
    display: flex;
    justify-content: space-between;
}

.left-side {
    display: flex;
    flex-direction: column;
}

.right-side {
    width: 40vw;
    display: flex;
    flex-direction: column;
}

.activity-graph {
    width: 100%;
    height: 50px;
    margin-top: 10px;
    padding: 15px;

    color: white;
    font-weight: bold;

    background-color: rgba(45, 120, 220, 0.5);
    border: 1pt solid #333;
}

.ministoTag {
    letter-spacing: 5px;
}
</style>
