export const Upload = {
    data() {
        return {
            maxWidth : MAX_WIDTH,//压缩图片最大宽度
            maxHeight: MAX_HEIGHT,//压缩图片最大高度
            quality  : 0.8//照片质量
        }
    },
  methods: {
    changeImageSize(src,callback) {
        let that = this;

        return new Promise((resolve,reject) => {
            const img = new Image();
            img.src = src;
            let newSrc = "";
    
            //压缩图片
            img.onload = function() {
                let iWidth = img.width;
                let iHeight = img.height;
                let nWidth = iWidth,
                    nHeight = iHeight;
    
                if (iWidth > iHeight) {
                    //宽型图片
                    if (iWidth > that.maxWidth) {
                        nWidth = that.maxWidth;
                        nHeight = iHeight / iWidth * nWidth;
                    }
                } else if (iHeight > iWidth) {
                    //高型图片
                    if (iHeight > that.maxHeight) {
                        nHeight = that.maxHeight;
                        nWidth = iWidth / iHeight * nHeight;
                    }
                }
    
                let can = document.createElement("canvas");
                let ctx = can.getContext("2d");
                can.width = nWidth;
                can.height = nHeight;
                ctx.drawImage(img, 0, 0, nWidth, nHeight);
    
                newSrc = can.toDataURL("image/jpeg", that.quality);
                
                resolve(newSrc)
            };
        })

    },
    upload(src,type) {
        let that = this;

        return new Promise((resolve,reject) => {
            that.changeImageSize(src).then(newSrc => {
                let uploadParams = {
                    image: newSrc,
                    attTyp: ''+type,
                    oldAtt: 'img',
                    busiNo: getLocalStorage('loanNo'),
                    busiType: "ios",
                    queryType: "temp",
                }
        
                this.$axios.post(url.uploadBase64, { params: uploadParams }).then(res => {
                    if (res.data.code == "0000") {
                        resolve(res.data)
                    } else {
                        that.$vux.toast.text(res.data.msg, "top");
                    }
                });
            })
        })

    }
  }
}

