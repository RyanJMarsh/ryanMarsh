const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM( "" );
const $ = require( "jquery" )( window );

const assert = require('assert');

const { getCountryList } = require('./js/requests.js')

describe('GetCountryList', () => {
    it('returns an array of length 175', () => {
        const list = getCountryList();

        assert.ok(list.length == 175)
    })
})