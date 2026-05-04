import React, { useCallback, useState, createContext, useContext, useEffect } from "react";
const ChildrenContext = createContext(null)
import { useAuth } from "./auth";
import { Base_URL } from "../../IpConfig";
export const ChildrenProvider = ({ children }) => {
    const { user } = useAuth()
    const [childrenList, setChildrenList] = useState([])
    const [child, setChild] = useState()
    const [selectedChildID, setSelectedChildID] = useState(null)
    console.log(user);
    useEffect(() => {
        if (user?.userType === 'Guardian') {
            fetchChildrens()
        }
    }, [fetchChildrens, user?.userType])
    const setChildren = (data) => {
        setChildrenList(data)
    }
    const setChildData = (data) => {
        setChild(data)
    }
    useEffect(() => {
        if (childrenList?.length > 0) {
            setSelectedChildID(childrenList[0].childrenID)
            setChildData(childrenList[0])
        }
    }, [childrenList])
    let fetchChildrens = useCallback(async (setLoading) => {
        try {
            setLoading(true)
            const response = await fetch(Base_URL + `Guardian/getChildren?guardianId=${user?.userID}`)
            if (response.ok) {
                const result = await response.json()
                setChildren(result?.data);
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }, [user?.userID])
    return (
        <ChildrenContext.Provider value={{ child, childrenList, setChildren, setChildData, fetchChildrens, selectedChildID, setSelectedChildID }}>
            {children}
        </ChildrenContext.Provider>
    )
}
export const useChildrens = () => useContext(ChildrenContext)