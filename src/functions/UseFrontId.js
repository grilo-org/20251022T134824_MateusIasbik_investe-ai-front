import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from "uuid"
import { useParams } from 'react-router-dom'

export function useFrontId() {
  const [frontId, setFrontId] = useState(null)
  const { frontId: frontIdFromUrl } = useParams()

  useEffect(() => {
    const idFromStorage = localStorage.getItem("token")

    if (frontIdFromUrl && frontIdFromUrl !== idFromStorage) {
      localStorage.setItem("token", frontIdFromUrl)
      setFrontId(frontIdFromUrl)
    } else if (idFromStorage) {
      setFrontId(idFromStorage)
    } else {
      const newId = uuidv4()
      localStorage.setItem("token", newId)
      setFrontId(newId)
    }
  }, [frontIdFromUrl])

  return frontId
}