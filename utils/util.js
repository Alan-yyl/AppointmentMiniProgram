const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime
}

/**
 * 将Date日期转为天数
 */
function chageDateToDay(date){
  //获取今年的年份
  var currentYear = new Date().getFullYear().toString();
  console.log(currentYear);
  //获取指定日期已经过的时间戳
  var hasTimeStamp = new Date() - new Date(currentYear);
  //计算已经过的时间戳相当于多少天,一天=86400000 = 24 * 60 * 60 * 1000毫秒
  console.log(Math.floor(hasTimeStamp / 86400000));
  var hasDays = Math.floor(hasTimeStamp / 86400000) + 1;
  console.log(hasDays)
}
