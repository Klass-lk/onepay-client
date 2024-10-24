'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"

const initialFormData = {
  currency: "LKR",
  amount: "202",
  app_id: "TEST123",
  reference: "1234567891",
  customer_first_name: "Johne",
  customer_last_name: "Dohe",
  customer_phone_number: "+94771234567",
  customer_email: "onepay@spemai.com",
  transaction_redirect_url: "https://onepay.lk",
  additional_data: "sample"
}

const OnepayPaymentRequest = () => {
  const [formData, setFormData] = useState(initialFormData)
  const [hashSalt, setHashSalt] = useState('')
  const [appToken, setAppToken] = useState('')
  const [url, setUrl] = useState('https://merchant-api-live-v2.onepay.lk/api/ipg/gateway/request-payment-link/')
  const [method, setMethod] = useState('POST')
  const [requestBody, setRequestBody] = useState(JSON.stringify(initialFormData, null, 2))
  const [response, setResponse] = useState('')
  const [hash, setHash] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('body')

  useEffect(() => {
    generateHash(formData, hashSalt).then()
  }, [formData, hashSalt])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted with data:', formData)
    setRequestBody(JSON.stringify(formData, null, 2))
    generateHash(formData, hashSalt).then()
  }

  const generateHash = async (data: typeof initialFormData, salt: string) => {
    const jsonString = JSON.stringify(data).replace(/\s/g, '')
    const stringToHash = jsonString + salt
    const encoder = new TextEncoder()
    const data_encoded = encoder.encode(stringToHash)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data_encoded)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    setHash(hashHex)
  }

  const handleSendRequest = async () => {
    setIsLoading(true)
    setResponse('Loading...')
    setActiveTab('response')
    try {
      const response = await fetch(`${url}?hash=${hash}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': appToken,
        },
        body: method !== 'GET' ? requestBody : undefined,
      })
      const data = await response.json()
      setResponse(JSON.stringify(data, null, 2))
      if (!response.ok) {
        throw new Error(data.message || 'An error occurred')
      }
    } catch (error) {
      // @ts-expect-error error contains a message
      setResponse(JSON.stringify({ error: error.message || 'An error occurred' }, null, 2))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4">
      <Card className="w-full md:w-1/2">
        <CardHeader>
          <CardTitle>OnePay Payment Link Request</CardTitle>
          <CardDescription>Please fill in the payment details</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
            {Object.entries(initialFormData).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={key}>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</Label>
                <Input
                  type={key.includes('email') ? 'email' : key.includes('phone') ? 'tel' : 'text'}
                  id={key}
                  name={key}
                  value={formData[key as keyof typeof formData]}
                  onChange={handleInputChange}
                  required
                />
                {key === 'app_id' && (
                  <>
                    <div className="mt-2">
                      <Label htmlFor="hash-salt">Hash Salt</Label>
                      <Input
                        id="hash-salt"
                        value={hashSalt}
                        onChange={(e) => setHashSalt(e.target.value)}
                        placeholder="Enter Hash Salt"
                      />
                    </div>
                    <div className="mt-2">
                      <Label htmlFor="app-token">App Token</Label>
                      <Input
                        id="app-token"
                        value={appToken}
                        onChange={(e) => setAppToken(e.target.value)}
                        placeholder="Enter App Token"
                      />
                    </div>
                  </>
                )}
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">Update Request Body</Button>
          </CardFooter>
        </form>
      </Card>

      <Card className="w-full md:w-1/2">
        <CardHeader>
          <CardTitle>API Request Interface</CardTitle>
          <CardDescription>Send and view API requests</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GET">GET</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="PUT">PUT</SelectItem>
                <SelectItem value="DELETE">DELETE</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Enter URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <Button onClick={handleSendRequest} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending
                </>
              ) : (
                'Send'
              )}
            </Button>
          </div>
          <div className="space-y-2">
            <Label htmlFor="hash">Generated Hash</Label>
            <Input id="hash" value={hash} readOnly />
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList>
              <TabsTrigger value="body">Body</TabsTrigger>
              <TabsTrigger value="response">Response</TabsTrigger>
            </TabsList>
            <TabsContent value="body">
              <Textarea
                placeholder="Request Body"
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
                className="min-h-[200px] font-mono"
              />
            </TabsContent>
            <TabsContent value="response">
              <Textarea
                placeholder="Response will appear here"
                value={response}
                readOnly
                className="min-h-[200px] font-mono"
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
export default OnepayPaymentRequest