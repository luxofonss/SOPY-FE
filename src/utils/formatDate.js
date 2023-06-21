import moment from 'moment/moment'

export default function formatDate(date) {
  const time = new Date(date)
  const customFormat = 'YYYY-MM-DDTHH:mm:ss.SSSZ'
  return moment(time).format(customFormat)
}
