type NeedleWunschOption = {
    match: number
    mismatch: number
    gap: number
}


export function needleWunsch(str1: string, str2: string, op: NeedleWunschOption = undefined): string[] {
    const opt = op || { match: 2, mismatch: 1, gap: -1 };
    const G = opt.match || 2;
    const P = opt.mismatch || 1;
    const M = opt.gap || -1;
    const mat   = {};
    const direc = {};

    const UP = 1
    const LEFT = 2
    const UL = 4

    // initialization
    for(let i=0; i<str1.length+1; i++) {
        mat[i] = {0:0};
        direc[i] = {0:[]};
        for(let j=1; j<str2.length+1; j++) {
            mat[i][j] = (i == 0)
                ? 0
                : (str1.charAt(i-1) == str2.charAt(j-1)) ? P : M
            direc[i][j] = [];
        }
    }

    // calculate each value
    for(let i=0; i< str1.length+1; i++) {
        for(let j=0; j<str2.length+1; j++) {
            const newval = (i == 0 || j == 0)
                ? -G * (i + j)
                : Math.max(mat[i-1][j] - G, mat[i-1][j-1] + mat[i][j], mat[i][j-1] -G);

            if (i > 0 && j > 0) {
                if( newval == mat[i-1][j] - G) direc[i][j].push(UP);
                if( newval == mat[i][j-1] - G) direc[i][j].push(LEFT);
                if( newval == mat[i-1][j-1] + mat[i][j]) direc[i][j].push(UL);
            }
            else {
                direc[i][j].push((j == 0) ? UP : LEFT);
            }
            mat[i][j] = newval;
        }
    }

    // get result
    const chars = [[],[]];
    let I = str1.length;
    let J = str2.length;
    const max = Math.max(I, J);
    while(I > 0 || J > 0) {
        switch (direc[I][J][0]) {
            case UP:
                I--;
                chars[0].push(str1.charAt(I));
                chars[1].push('-');
                break;
            case LEFT:
                J--;
                chars[0].push('-');
                chars[1].push(str2.charAt(J));
                break;
            case UL:
                I--;
                J--;
                chars[0].push(str1.charAt(I));
                chars[1].push(str2.charAt(J));
                break;
            default: break;
        }
    }

    return chars.map(function(v) {
        return v.reverse().join('');
    });
}