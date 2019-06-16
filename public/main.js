const TARGET_URL = 'http://localhost:5500'

const form = document.getElementById('vote-form')
form.addEventListener('submit', event => {
  event.preventDefault()
  const checked = document.querySelector('input[name=os]:checked')
  const value = checked ? checked.value : null
  if (value) {
    const data = { os: value }

    fetch(`${TARGET_URL}/poll`,{
      method: 'post',
      body: JSON.stringify(data),
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    })
      .then( res => console.log('post success') )
      .catch( err => console.log(err))
  }
})

let voteCount = 0

let dataPoints = [
  { label: 'Windows', y: 0 },
  { label: 'Linux', y: 0 },
  { label: 'MacOS', y: 0 }
]

const chartContainer = document.getElementById('chart-container')

if(chartContainer) {
  const chart = new CanvasJS.Chart('chart-container', {
    animationEnabled: true,
    theme: 'theme1',
    title: {
      text: `OS Results based on ${voteCount} votes`
    },
    data: [
      {
        type: 'column',
        dataPoints: dataPoints
      }
    ]
  })
  chart.render()

  const pusher = new Pusher('ab26edbeadaf4d0cd876', {
    cluster: 'eu',
    forceTLS: true
  })
  
  const channel = pusher.subscribe('poll-channel')
  channel.bind('poll-vote-event', function(data) {
    voteCount += 1
    chart.set('title', { text: `OS Results based on ${voteCount} votes` } )
    dataPoints = dataPoints.map( point => {
      if (point.label === data.vote) {
        point.y += data.points
      }
      return point
    })
    chart.render()
  })

  fetch(`${TARGET_URL}/poll`)
    .then( res => res.json() )
    .then( votes => {
      voteCount = votes.length
      const voteValues = votes.reduce((values, data)=>{
        if(values.hasOwnProperty(data.vote)) {
          values[data.vote] += data.points
        } else {
          values[data.vote] = data.points
        }
        return values
      }, {})
      dataPoints = dataPoints.map( point => {
        point.y = voteValues[point.label]
        return point
      })
      chart.render()
    })
    .catch( err => console.log(err))
}



