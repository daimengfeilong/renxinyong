/**
 * Created by PC on 2018/7/9.
 */
let distanceCAL = function(coordinate1, coordinate2) {
    //计算两点间距离,参数为两个坐标对象，示例: distanceCAL({x: 10, y: 10}, {x: 20, y: 20})
    if (coordinate1 && coordinate2) {
        var calX = coordinate2.x - coordinate1.x,
            calY = coordinate2.y - coordinate1.y,
            resultVal;
        resultVal = parseFloat(Math.sqrt((calX * calX + calY * calY)).toFixed(2));
    } else {
        console.log("参数错误");
    }
    return resultVal;
}

let angleCal = function(coordinate1, coordinate2, coordinate3) {
    //计算三点间连线角度,计算最大角是否为直角,用于校验身份证照片是否符合规范,参数是三个坐标对象
    //coordinate1是要被验证直角的坐标，从coordinate1开始坐标逆时针摆放，coordinate2、coordinate3是coordinate1相邻的两个坐标
    //重要是事情说三遍：参数1是要被验证直角的坐标！！！参数1是要被验证直角的坐标！！！参数1是要被验证直角的坐标！！！
    //参数2、参数3是参数1相邻的两个坐标，注意是参数1的相邻坐标，别把参数3传成参数2的相邻坐标了。
    //可以自己手动画个草图将坐标连线，若直角所在的坐标不是第一个参数，那就说明参数传错了。
    //示例1: angleCal({x: 10, y: 10}, {x: 10, y: 20}, {x: 20, y: 10})。验证{x: 10, y: 10}坐标所在角是否为直角
    //示例2: angleCal({x: 20, y: 20}, {x: 20, y: 10}, {x: 10, y: 20})。验证{x: 20, y: 20}坐标所在角是否为直角
    if (coordinate1 && coordinate2 && coordinate3) {
        var lengthAB = distanceCAL(coordinate1, coordinate2),
            lengthAC = distanceCAL(coordinate1, coordinate3),
            lengthBC = distanceCAL(coordinate2, coordinate3);
        var cosA = (lengthAB * lengthAB + lengthAC * lengthAC - lengthBC * lengthBC) / (2 * lengthAB * lengthAC),
            cosB = (lengthAB * lengthAB + lengthBC * lengthBC - lengthAC * lengthAC) / (2 * lengthAB * lengthBC),
            cosC = (lengthAC * lengthAC + lengthBC * lengthBC - lengthAB * lengthAB) / (2 * lengthAC * lengthBC);
        var angleBAC = Math.round(Math.acos(cosA) * 180 / Math.PI),
            angleABC = Math.round(Math.acos(cosB) * 180 / Math.PI),
            angleACB = Math.round(Math.acos(cosC) * 180 / Math.PI);
        var angle = {
            A: angleBAC, //最大角，看这个角是否为直角
            B: angleABC, //相邻一角
            C: angleACB //相邻一角
        };
    } else {
        console.log("参数错误");
    }
    //console.log(angle);   //示例1的计算结果为A：90°，B：45°，C：45°，示例2的计算结果为A：90°，B：45°，C：45°
    return angle;
}

let computeAllLine = function(arg) {
    // 计算出身份证四条边的长度并返回
    if (arg instanceof Object) {
        let lineData = {}
        lineData.lineTop = distanceCAL(arg.lt, arg.rt)
        lineData.lineRight = distanceCAL(arg.rt, arg.rb)
        lineData.lineBottom = distanceCAL(arg.lb, arg.rb)
        lineData.lineLeft = distanceCAL(arg.lt, arg.lb)
        console.log(lineData)
        return lineData
    } else {
        console.log('参数错误')
    }
}

let computeAllAngle = function(arg) {
    // 计算出身份证四个角度的值并返回
    if (arg instanceof Object) {
        let angleData = {}
        angleData.lt = angleCal(arg.lt, arg.lb, arg.rt).A
        angleData.lb = angleCal(arg.lb, arg.rb, arg.lt).A
        angleData.rb = angleCal(arg.rb, arg.rt, arg.lb).A
        angleData.rt = angleCal(arg.rt, arg.lt, arg.rb).A
        console.log(angleData)
        return angleData
    } else {
        console.log('参数错误')
    }
}

let computeTilt = function(arg) {
    // 计算身份证在照片中的倾斜度
    if (arg instanceof Object) {
        let tiltData = "",
            thirdCoordinate = { x: arg.lt.x, y: arg.rt.y }
        tiltData = angleCal(thirdCoordinate, arg.lt, arg.rt).C
        console.log(tiltData)
        return tiltData
    } else {
        console.log('参数错误')
    }
}

let checkIdCard = function(arg) {
    if (arg instanceof Object) {
        let tilt = computeTilt(arg),
            allAngle = computeAllAngle(arg)
        if (tilt >= 10 && tilt <= 80) {
            return false
        } else if ((allAngle.lt <= 80 || allAngle.lt >= 100) || (allAngle.lb <= 80 || allAngle.lb >= 100) ||
            (allAngle.rb <= 80 || allAngle.rb >= 100) || (allAngle.rt <= 80 || allAngle.rt >= 100)) {
            return false
        }
        return true
    } else {
        console.log('参数错误')
    }
}
export { computeAllLine, computeAllAngle, checkIdCard }
