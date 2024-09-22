import { ChangeEvent, useEffect, useState } from 'react'
import { forecastType, optionType } from '../types'

const useForecast = () => {
  const [term, setTerm] = useState<string>('')
  const [city, setCity] = useState<optionType | null>(null)
  const [options, setOptions] = useState<[]>([])
  const [forecast, setForecast] = useState<forecastType | null>(null)
  const getSearchOptions = (value: string) => {
    fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${value.trim()}&limit=5&appid=${process.env.REACT_APP_API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => setOptions(data))
      .catch((err) => console.log(err))
  }

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setTerm(value)
    getSearchOptions(value)
  }
  const getForcast = (city: optionType) => {
    const { lat, lon } = city

    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.REACT_APP_API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        const forecastData = {
          ...data.city,
          list: data.list.slice(0, 16),
        }
        setForecast(forecastData)
      })
      .catch((e) => console.log(e))
  }
  const onSubmit = () => {
    if (!city) return
    getForcast(city)
  }

  const onOptionSelect = (option: optionType) => {
    setCity(option)
  }

  useEffect(() => {
    if (city) {
      setTerm(city.name)
      setOptions([])
    }
  }, [city])

  return {
    term,
    options,
    forecast,
    onSubmit,
    onInputChange,
    onOptionSelect,
  }
}

export default useForecast
