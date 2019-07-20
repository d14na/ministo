const state = {
    /* Initialize stage screen id. */
    screenId: '',

    /* Initialize account (empty Ethereum address). */
    account: 0x0,

    /* Initialize email address. */
    email: ''
}

const mutations = {
    // TEMP FOR TESTING PURPOSES ONLY
    CLEAR_EMAIL (_state) {
        _state.email = ''
    },

    /* Update stage screen id. */
    UPDATE_SCREEN_ID (_state, _screenId) {
        _state.screenId = _screenId
    },

    /* Update account. */
    UPDATE_ACCOUNT (_state, _account) {
        _state.account = _account
    },

    /* Update email. */
    UPDATE_EMAIL (_state, _email) {
        _state.email = _email
    }
}

const getters = {
    /* Initialize stage screen id. */
    screenId: _state => _state.screenId,

    /* Initialize identity screen id. */
    identityScreenId: _state => _state.identityScreenId,

    /* Initialize account. */
    account: _state => _state.account,

    /* Initialize email. */
    email: _state => _state.email
}

const actions = {
    // TEMP FOR TESTING PURPOSES ONLY
    clearEmail: ({ commit }) => commit('CLEAR_EMAIL'),

    /* Request stage screen id update. */
    updateScreenId: ({ commit }, _screenId) => commit('UPDATE_SCREEN_ID', _screenId),

    /* Request account update. */
    updateAccount: ({ commit }, _account) => commit('UPDATE_ACCOUNT', _account),

    /* Request email update. */
    updateEmail: ({ commit }, _email) => commit('UPDATE_EMAIL', _email)
}

export default {
    state,
    mutations,
    getters,
    actions
}
