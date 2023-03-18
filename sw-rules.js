// 这个文件中所有“module.exports.cacheList”都会被替换为“const cacheList”
// 同理，“module.exports.modifyRequest”会被替换为“const modifyRequest”
// 请勿在非声明的位置使用这两个字符串，否则会被替换掉

/**
 * 缓存列表
 * @param clean 清理全站时是否删除其缓存
 * @param match {function(URL)} 匹配规则
 */
module.exports.cacheList = {
    // 这个 [simple] 就是规则的名称，该对象下可以包含多个规则，名称不影响缓存匹配
    // 缓存匹配时按声明顺序进行匹配
    simple: {
        // [clean] 项用于声明符合该规则的缓存在进行全局清理时是否清除
        // 如果你无法确定是否需要声明为 false 的话写 true 即可
        clean: true,
        // 该项用于匹配缓存，传入的参数是 URL 类型的，返回一个 boolean
        match: url => {
            switch (url.hostname) {
                case 'lynxcatthethird.github.io': case 'ara1145.github.io':
                case 'lynxcatthethird.xszcd.top': case 'vc.lynxcatthethird.eu.org': case 'person-vercel-hg5ql74fw-lynxcatthethird.vercel.app': case 'person-vercel.vercel.app':
                case 'lynxcatthethird-person.pages.dev': case 'cf.lynxcatthethird.eu.org':
                case 'lynxcatthethird-person.netlify.app': case 'nl.lynxcatthethird.eu.org':
                    return url.pathname.match(/\.(woff2|ttf|js|css)$/)
                default: return false
            }
        }
    }
}
