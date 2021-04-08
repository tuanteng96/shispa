import { SERVER_APP } from "./config";
export const PHOTO_TO_SERVER = (_opt) => {
    var t = window.app21 || {};
    var opt = {
        maxwidth: 5000,
        maxheight: 5000,
        ext: 'png',
        pref: 'IMG',
        server: `${SERVER_APP}/api/v3/file?cmd=upload&autn=AAAA`
    };
    opt = Object.assign(opt, _opt);

    var cameraOpt = {
        maxwidth: 5000,
        maxheight: 5000,
        ext: 'png',
        pref: 'IMG',
    }

    for (var k in cameraOpt) {
        if (opt[k]) cameraOpt[k] = opt[k];
    }
    return new Promise((resolve, reject) => {
        t.prom('CAMERA', cameraOpt).then(s => {

            t.prom('POST_TO_SERVER', JSON.stringify({
                server: opt.server,
                path: s.data
                    // token: 'neu_co',
            })).then(s1 => {
                var rs = JSON.parse(s1.data);
                //console.log('app_camera->CAMERA->POST_TO_SERVER->OK', rs.data);
                // vm.$emit('success', rs.data);
                resolve(rs);
            }).catch(f1 => {
                reject({ title: 'POST_TO_SERVER FAIL', error: f1 })
            });
        }).catch(e => {
            reject({ title: 'CAMERA FAIL', error: e })
        })
    })
}

export const CALL_PHONE = (phone) => {
    var t = window.app21 || {};
    if (typeof t.prom !== 'undefined') {
        t.prom('TEL', phone);
    }
}