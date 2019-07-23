<template>
    <div id="wrapper">
        <img id="logo" src="~@/assets/logo.png" alt="Ministo Icon" @click="toggleGaia">

        <main>
            <div class="left-side">
                <span class="title">
                    Welcome to your new project!
                </span>

                <!-- <system-information></system-information> -->
            </div>

            <div class="right-side">
                <div class="doc">
                    <div class="title">Getting Started</div>
                    <p>
                        electron-vue comes packed with detailed documentation that covers everything from
                        internal configurations, using the project structure, building your application,
                        and so much more.
                    </p>

                    <button @click="open('https://simulatedgreg.gitbooks.io/electron-vue/content/')">Read the Docs</button><br><br>
                </div>

                <div class="doc">
                    <div class="title alt">Other Documentation</div>
                    <button class="alt" @click="open('https://electron.atom.io/docs/')">Electron</button>
                    <button class="alt" @click="open('https://vuejs.org/v2/guide/')">Vue.js</button>
                </div>
            </div>
        </main>

        <v-btn flat color="primary flat" @click="startMining">Start Mining</v-btn>

        <v-flex xs12 sm6 md3>
          <v-text-field
            label="Nickname"
            outline
          ></v-text-field>
        </v-flex>

        <v-avatar
          id="avatar"
          :size="avatarSize"
          color="grey lighten-4"
        >
          <img src="~@/assets/icons/png/64x64.png" alt="icon">
        </v-avatar>

        <v-btn flat icon color="pink">
            <v-icon>favorite</v-icon>
        </v-btn>

        <v-flex xs12 sm6 class="py-2">
                    <p>Exclusive</p>
                    <v-btn-toggle true>
                      <v-btn flat>
                        <v-icon>format_align_left</v-icon>
                      </v-btn>
                      <v-btn flat>
                        <v-icon>format_align_center</v-icon>
                      </v-btn>
                      <v-btn flat>
                        <v-icon>format_align_right</v-icon>
                      </v-btn>
                      <v-btn flat>
                        <v-icon>format_align_justify</v-icon>
                      </v-btn>
                    </v-btn-toggle>
                  </v-flex>

        <v-select
          :items="items"
          label="Standard"
        ></v-select>

        <!-- <i class="material-icons">contact_support</i> -->
        <v-icon x-large>home</v-icon>
        <v-icon x-large>heart</v-icon>
        <v-icon x-large dark>gavel</v-icon>

        <h3>Email Address</h3>
        <v-btn color="primary" @click="resetEmail">Reset2</v-btn>
        <v-btn flat color="primary" @click="resetEmail">Reset2</v-btn>

        <div @click="clearEmail">{{emailAddress}}</div>

        <h3>Current Difficulty</h3>

        {{challengeDisplay}}

        <v-layout>
            <v-flex xs12 sm6 offset-sm3>
              <v-card>
                <v-img
                  src="https://cdn.vuetifyjs.com/images/cards/desert.jpg"
                  aspect-ratio="2.75"
                ></v-img>

                <v-card-title primary-title>
                  <div>
                    <h3 class="headline mb-0">Kangaroo Valley Safari</h3>
                    <div>Located two hours south of Sydney in the <br>Southern Highlands of New South Wales, ...</div>
                  </div>
                </v-card-title>

                <v-card-actions>
                  <v-btn flat color="orange">Share</v-btn>
                  <v-btn flat color="orange">Explore</v-btn>
                </v-card-actions>
              </v-card>
            </v-flex>
          </v-layout>
    </div>



</template>

<script>
import {
    mapActions,
    mapGetters
} from 'vuex'

import SystemInformation from './LocalStats/SystemInformation'

export default {
    data: () => ({
        challengeNumber: null,
        avatarSize: 64,
        showGaia: false,
        items: ['Foo', 'Bar', 'Fizz', 'Buzz']
    }),
    components: {
        SystemInformation
    },
    computed: {
        ...mapGetters([
            'account',
            'email'
        ]),
        challengeDisplay () {
            if (this.challengeNumber) {
                return this.challengeNumber
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
        resetEmail () {
            this.updateEmail('satoshi@nakamoto.gov - ' + Date.now())
            // this.$store.dispatch(
            //     'updateEmail', 'satoshi@nakamoto.gov - ' + Date.now())
        },
        open (link) {
            // this.$electron.shell.openExternal(link)
        },
        startMining () {
            console.log('Start CPU mining.')

            // Miner.mine()
        },
        toggleGaia () {
            console.log('Toggle Gaia')

            this.showGaia = !this.showGaia
        }
    },
    mounted: async function () {
        /* Set stats url */
        const statsUrl = 'http://localhost:3000/stats'

        /* Fetch data. */
        const response = await fetch(statsUrl)

        /* Parse JSON. */
        const stats = await response.json()

        // console.log('STATS', stats)

        /* Set challenge number. */
        if (stats.challengeNumber) {
            this.challengeNumber = stats.challengeNumber
        }
    }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body { font-family: 'Source Sans Pro', sans-serif; }

#wrapper {
    background:
        radial-gradient(
            ellipse at top left,
            rgba(255, 255, 255, 1) 40%,
            rgba(229, 229, 229, .9) 100%
        );
    /* height: 100vh; */
    padding: 30px 40px;
    width: 100vw;
}

#logo {
    position: absolute;
    bottom: 10px;
    right: 5px;
    width: 64px;
}

#avatar {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 128px;
}

main {
    display: flex;
    justify-content: space-between;
}

main > div { flex-basis: 50%; }

.left-side {
    display: flex;
    flex-direction: column;
}

.welcome {
    color: #555;
    font-size: 23px;
    margin-bottom: 10px;
}

.title {
    // color: $primary-color;
    // color: #2c3e50;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 6px;
}

.title.alt {
    font-size: 18px;
    margin-bottom: 10px;
}

.doc p {
    color: black;
    margin-bottom: 10px;
}

.doc button {
    font-size: .8em;
    cursor: pointer;
    outline: none;
    padding: 0.75em 2em;
    border-radius: 2em;
    display: inline-block;
    color: #fff;
    background-color: #4fc08d;
    transition: all 0.15s ease;
    box-sizing: border-box;
    border: 1px solid #4fc08d;
}

.doc button.alt {
    color: #42b983;
    background-color: transparent;
}
</style>
