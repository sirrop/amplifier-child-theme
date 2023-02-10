import {equals} from "../../tsMain/util/Arrays";

function testEquals(): boolean {
    let successAll = true

    // trueになる例
    console.assert(successAll &&= equals([0, 1, 2, 3, 4], [0, 1, 2, 3, 4]), 'Test util/Arrays::testEquals sample1 (predicate: true, actual: false)')

    // 一部の要素が異なる例. predicate: false
    console.assert(successAll &&= !equals([0, 1, 2], [1, 1, 1]), 'Test util/Arrays::testEquals sample2 (predicate: false, actual, true)')

    // 配列の一方が空である例. predicate: false
    console.assert(successAll &&= !equals([0, 1, 2], []), 'Test util/Arrays::testEquals sample3 (predicate: false, actual: true)')

    // 配列が両方ともに空である例. predicate: true
    console.assert(successAll &&= equals([], []), 'Test util/Arrays::testEquals sample4 (predicate: true, actual: false)')

    // 順番が異なる例. predicate: false
    console.assert(successAll &&= !equals([0, 1], [1, 0]), 'Test util/Arrays::testEquals sample5 (predicate: false, actual: true)')

    // tuple. predicate: true
    console.assert(successAll &&= equals([0, '1', 'foo'], [0, '1', 'foo']), 'Test util/Arrays::testEquals sample6 (predicate: true, actual: false)')

    // tuple. predicate: false
    console.assert(successAll &&= !equals([0, '1'], [0, 1]), 'Test util/Arrays::testEquals sample7 (predicate: false, actual: true)')

    return successAll
}

export function testArrays() {
    console.log('Test: util/Arrays')
    let successAll = true
    successAll &&= testEquals()
    console.log(successAll ? 'Succeeded Tests: util/Arrays' : '')
}