/* data encryption + storage functions for hardbin
 * make sure to also load jquery + aes.js
 */
var gateways = ['https://ipfs.blockframe.io','https://ipfs.crossbell.io','https://4everland.io','https://polygon.stampsdaq.com','https://ipfs.supremelegend.io','https://ipfs.decentralized-content.com','https://gateway.pinata.cloud','https://eth.sucks','https://hardbin.com','https://gw.ipfs-lens.dev','https://gateway.v2ex.pro','https://gateway.tar.tn'];
function seeding(res){
    for(var i0 = 0; i0 < gateways.length; i0++)
    {
        let img = new Image;
        img.src =  gateways[i0]+ '/ipfs/'+res.Hash  + "?filename=" + encodeURI(res.Name);
    }
}
function encrypt(data, key) {
    return CryptoJS.AES.encrypt(data, key).toString();
}

function decrypt(data, key) {
    return CryptoJS.AES.decrypt(data, key).toString(CryptoJS.enc.Utf8);
}

function generate_key() {
    var alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

    var randombytes = new Uint8Array(32);
    crypto.getRandomValues(randombytes);
    return base58.encode(Array.from(randombytes));
}

function is_local_gateway() {
    return window.location.hostname == 'localhost';
}

function write(content, cb) {
    const blob = new Blob([content], { type: 'plain/text' });
    let api = '';
    if($("#api").val().length > 10) {
        api = $("#api").val() + '/api/v0/add';
    } else {
        api = DEFAULT_API+ '/api/v0/add';
    }
    const formData = new FormData();
    formData.append('file', blob);

    $.ajax({
        url: api,
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function(res) {
            if (res.Hash) {
                console.log(res.Hash);
                setTimeout(seeding(res),1)
                setTimeout(cb(res.Hash),3000)
            } else {
                console.error('上传失败');
            }
        },
        error: function() {
            console.error('请求失败');
        }
    });

}
