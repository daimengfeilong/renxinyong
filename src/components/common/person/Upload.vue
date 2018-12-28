<style lang="less">

</style>

<template>
    <div class="upload-item">
        <img :src="bmp" alt="">
        <div v-if="image" class="upload-preview" :style="{backgroundImage:`url(${image})`}"></div>
        <input type="file" accept="image/*" @change="changeFile">
    </div>
</template>

<script>
export default {
    props: {
        name: {
            type: String,
            default: ""
        },
        attTyp: {
            type: String,
            default: ""
        },
        maxWidth: {
            type: Number,
            default: MAX_WIDTH
        },
        maxHeight: {
            type: Number,
            default: MAX_HEIGHT
        },
        bmp: {
            required: true,
            type: String
        },
        image: {
            required: true,
            type: String
        },
        quality: {
            type: Number,
            default: 0.8
        }
    },
    mounted() {
        let that = this;
    },
    methods: {
        changeFile(e) {
            let that = this;
            let files = e.target.files;
            let maxsize = 10 * 1024 * 1024; //10M
            const reader = new FileReader();

            //获取图片文件
            reader.onload = function(e) {
                //that.image = e.target.result;
                that.changeImageSize(e.target.result).then(newSrc => {
                    that.upload(newSrc)
                })
            };
            reader.readAsDataURL(files[0]);
        },
        changeImageSize(src) {
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
                    resolve(newSrc);
                };
            })

        },
        upload(bold) {
            let that = this;
            let obj = {
                image: bold,
                attTyp: that.attTyp,
                oldAtt: that.name
            };

            //上传操作
            that.$emit("upload", obj);
        }
    }
};
</script>