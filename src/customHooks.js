import { useEffect } from "react";

export const useCovidEstimator = (data, dispatch, setChartData, setChartOptions) => {
  useEffect(() => {
    // set data.fetching to true
    dispatch({type: 'FETCHING', fetching: true});
    // post data to get estimates from api
    fetch(`https://covid19impactestimator.herokuapp.com/api/v1/on-covid-19/json`,
    {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify()
    })
    .then(data => data.json())
    .then(data => {
      // set data
      dispatch({type: 'FETCH', data});
      // set chartData
      setChartData(() => {
        return {
          labels: [
            'currently infected',
            'infections by requested time',
            'severe cases by requested time',
            'hospital beds by requested time',
            'cases for ICU by requested time',
            'cases for ventilators by requested time',
            'dollars in flight'
          ],
          datasets: [{
              label: '# of Votes',
              data: [
                data.impact.currentlyInfected,
                data.impact.infectionsByRequestedTime,
                data.impact.severeCasesByRequestedtime,
                data.impact.hospitalBedsByRequestedTime,
                data.impact.casesForICUByRequestedTime,
                data.impact.casesForVentilatorsByRequestedTime,
                data.impact.dollarsInFlight
              ],
              backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
          }]
      }
      });
      // set chart options
      setChartOptions(() => {
        return {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero: true
                  }
              }]
          }
      }
      });
      // set data.fetching to false
      dispatch({type: 'FETCHING', fetching: false});
      console.log(`data ${data}`)
    }).catch(error => {
      dispatch({type: 'FETCHING', fetching: false});
      return error;
    });
  }, [data, dispatch, setChartData, setChartOptions]);
}