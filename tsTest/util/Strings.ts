import {needleWunsch} from "../../tsMain/util/Strings";
import {equals} from "../../tsMain/util/Arrays";

function needleWunschTest() {
    console.assert(equals(needleWunsch('ATTGC', 'ATGC'), ['ATTGC', 'AT-GC']))
}

export function testStrings() {
    console.log('Test: util/Strings')
    needleWunschTest()
    console.log('')
}