/* data encryption + storage functions for hardbin
 * make sure to also load jquery + aes.js
 */

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
    const api = 'https://cdn.ipfsscan.io/api/v0/add?pin=false';
    const formData = new FormData();
    formData.append('file', blob);

    $.ajax({
        url: api,
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function(response) {
            if (response.Hash) {
                console.log(response.Hash);
                cb(response.Hash);
            } else {
                console.error('上传失败');
            }
        },
        error: function() {
            console.error('请求失败');
        }
    });

}
