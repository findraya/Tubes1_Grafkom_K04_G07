function _argumentsToArray( args ) {
    return [].concat.apply( [], Array.prototype.slice.apply(args) );
}

function radians( degrees ) {
    return degrees * Math.PI / 180.0;
}

function vec2()
{
    var result = _argumentsToArray( arguments );

    switch ( result.length ) {
    case 0: result.push( 0.0 );
    case 1: result.push( 0.0 );
    }

    return result.splice( 0, 2 );
}

function vec3()
{
    var result = _argumentsToArray( arguments );

    switch ( result.length ) {
    case 0: result.push( 0.0 );
    case 1: result.push( 0.0 );
    case 2: result.push( 0.0 );
    }

    return result.splice( 0, 3 );
}

function vec4()
{
    var result = _argumentsToArray( arguments );

    switch ( result.length ) {
    case 0: result.push( 0.0 );
    case 1: result.push( 0.0 );
    case 2: result.push( 0.0 );
    case 3: result.push( 1.0 );
    }

    return result.splice( 0, 4 );
}

function mat2()
{
    var v = _argumentsToArray( arguments );

    var m = [];
    switch ( v.length ) {
    case 0:
        v[0] = 1;
    case 1:
        m = [
            vec2( v[0],  0.0 ),
            vec2(  0.0, v[0] )
        ];
        break;

    default:
        m.push( vec2(v) );  v.splice( 0, 2 );
        m.push( vec2(v) );
        break;
    }

    m.matrix = true;

    return m;
}

function mat3()
{
    var v = _argumentsToArray( arguments );

    var m = [];
    switch ( v.length ) {
    case 0:
        v[0] = 1;
    case 1:
        m = [
            vec3( v[0],  0.0,  0.0 ),
            vec3(  0.0, v[0],  0.0 ),
            vec3(  0.0,  0.0, v[0] )
        ];
        break;

    default:
        m.push( vec3(v) );  v.splice( 0, 3 );
        m.push( vec3(v) );  v.splice( 0, 3 );
        m.push( vec3(v) );
        break;
    }

    m.matrix = true;

    return m;
}

function mat4()
{
    var v = _argumentsToArray( arguments );

    var m = [];
    switch ( v.length ) {
    case 0:
        v[0] = 1;
    case 1:
        m = [
            vec4( v[0], 0.0,  0.0,   0.0 ),
            vec4( 0.0,  v[0], 0.0,   0.0 ),
            vec4( 0.0,  0.0,  v[0],  0.0 ),
            vec4( 0.0,  0.0,  0.0,  v[0] )
        ];
        break;

    default:
        m.push( vec4(v) );  v.splice( 0, 4 );
        m.push( vec4(v) );  v.splice( 0, 4 );
        m.push( vec4(v) );  v.splice( 0, 4 );
        m.push( vec4(v) );
        break;
    }

    m.matrix = true;

    return m;
}

function translate( x, y, z )
{
    if ( Array.isArray(x) && x.length == 3 ) {
        z = x[2];
        y = x[1];
        x = x[0];
    }

    var result = mat4();
    result[0][3] = x;
    result[1][3] = y;
    result[2][3] = z;

    return result;
}

function rotate( angle, axis )
{
    if ( !Array.isArray(axis) ) {
        axis = [ arguments[1], arguments[2], arguments[3] ];
    }

    var v = normalize( axis );

    var x = v[0];
    var y = v[1];
    var z = v[2];

    var c = Math.cos( radians(angle) );
    var omc = 1.0 - c;
    var s = Math.sin( radians(angle) );

    var result = mat4(
        vec4( x*x*omc + c,   x*y*omc - z*s, x*z*omc + y*s, 0.0 ),
        vec4( x*y*omc + z*s, y*y*omc + c,   y*z*omc - x*s, 0.0 ),
        vec4( x*z*omc - y*s, y*z*omc + x*s, z*z*omc + c,   0.0 ),
        vec4()
    );

    return result;
}

function transpose( m )
{
    if ( !m.matrix ) {
        return "transpose(): mencoba untuk melakukan transpos sebuah non matriks";
    }

    var result = [];
    for ( var i = 0; i < m.length; ++i ) {
        result.push( [] );
        for ( var j = 0; j < m[i].length; ++j ) {
            result[i].push( m[j][i] );
        }
    }

    result.matrix = true;

    return result;
}

function dot( u, v )
{
    if ( u.length != v.length ) {
        throw "dot(): vektor memiliki dimensi yang berbeda";
    }

    var sum = 0.0;
    for ( var i = 0; i < u.length; ++i ) {
        sum += u[i] * v[i];
    }

    return sum;
}

function length( u )
{
    return Math.sqrt( dot(u, u) );
}

function normalize( u, excludeLastComponent )
{
    if ( excludeLastComponent ) {
        var last = u.pop();
    }

    var len = length( u );

    if ( !isFinite(len) ) {
        throw "normalisasi: vector " + u + " panjangnya nol";
    }

    for ( var i = 0; i < u.length; ++i ) {
        u[i] /= len;
    }

    if ( excludeLastComponent ) {
        u.push( last );
    }

    return u;
}

function scale( s, u )
{
    if ( !Array.isArray(u) ) {
        throw "scale: parameter kedua " + u + " bukanlah sebuah vektor";
    }

    var result = [];
    for ( var i = 0; i < u.length; ++i ) {
        result.push( s * u[i] );
    }

    return result;
}

function flatten( v )
{
    if ( v.matrix === true ) {
        v = transpose( v );
    }

    var n = v.length;
    var elemsAreArrays = false;

    if ( Array.isArray(v[0]) ) {
        elemsAreArrays = true;
        n *= v[0].length;
    }

    var floats = new Float32Array( n );

    if ( elemsAreArrays ) {
        var idx = 0;
        for ( var i = 0; i < v.length; ++i ) {
            for ( var j = 0; j < v[i].length; ++j ) {
                floats[idx++] = v[i][j];
            }
        }
    }
    else {
        for ( var i = 0; i < v.length; ++i ) {
            floats[i] = v[i];
        }
    }

    return floats;
}

var sizeof = {
    'vec2' : new Float32Array( flatten(vec2()) ).byteLength,
    'vec3' : new Float32Array( flatten(vec3()) ).byteLength,
    'vec4' : new Float32Array( flatten(vec4()) ).byteLength,
    'mat2' : new Float32Array( flatten(mat2()) ).byteLength,
    'mat3' : new Float32Array( flatten(mat3()) ).byteLength,
    'mat4' : new Float32Array( flatten(mat4()) ).byteLength
};

function det2(m)
{

     return m[0][0]*m[1][1]-m[0][1]*m[1][0];

}

function det3(m)
{
     var d = m[0][0]*m[1][1]*m[2][2]
           + m[0][1]*m[1][2]*m[2][0]
           + m[0][2]*m[2][1]*m[1][0]
           - m[2][0]*m[1][1]*m[0][2]
           - m[1][0]*m[0][1]*m[2][2]
           - m[0][0]*m[1][2]*m[2][1]
           ;
     return d;
}

function det4(m)
{
     var m0 = [
         vec3(m[1][1], m[1][2], m[1][3]),
         vec3(m[2][1], m[2][2], m[2][3]),
         vec3(m[3][1], m[3][2], m[3][3])
     ];
     var m1 = [
         vec3(m[1][0], m[1][2], m[1][3]),
         vec3(m[2][0], m[2][2], m[2][3]),
         vec3(m[3][0], m[3][2], m[3][3])
     ];
     var m2 = [
         vec3(m[1][0], m[1][1], m[1][3]),
         vec3(m[2][0], m[2][1], m[2][3]),
         vec3(m[3][0], m[3][1], m[3][3])
     ];
     var m3 = [
         vec3(m[1][0], m[1][1], m[1][2]),
         vec3(m[2][0], m[2][1], m[2][2]),
         vec3(m[3][0], m[3][1], m[3][2])
     ];
     return m[0][0]*det3(m0) - m[0][1]*det3(m1)
         + m[0][2]*det3(m2) - m[0][3]*det3(m3);

}

function det(m)
{
     if(m.matrix != true) console.log("bukan sebuah matriks");
     if(m.length == 2) return det2(m);
     if(m.length == 3) return det3(m);
     if(m.length == 4) return det4(m);
}