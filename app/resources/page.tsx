"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, ExternalLink, FileText, Presentation, LinkIcon, Search, Archive } from "lucide-react"
import { mockResources } from "@/lib/mock-data"

export default function ResourcesPage() {
  const [resources, setResources] = useState(mockResources)
  const [filteredResources, setFilteredResources] = useState(mockResources)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedDay, setSelectedDay] = useState("all")

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    filterResources(term, selectedType, selectedDay)
  }

  const handleTypeFilter = (type: string) => {
    setSelectedType(type)
    filterResources(searchTerm, type, selectedDay)
  }

  const handleDayFilter = (day: string) => {
    setSelectedDay(day)
    filterResources(searchTerm, selectedType, day)
  }

  const filterResources = (search: string, type: string, day: string) => {
    let filtered = resources

    if (search) {
      filtered = filtered.filter(
        (resource) =>
          resource.title.toLowerCase().includes(search.toLowerCase()) ||
          resource.sessionTitle.toLowerCase().includes(search.toLowerCase()) ||
          resource.speaker.toLowerCase().includes(search.toLowerCase()),
      )
    }

    if (type !== "all") {
      filtered = filtered.filter((resource) => resource.type === type)
    }

    if (day !== "all") {
      filtered = filtered.filter((resource) => resource.day === day)
    }

    setFilteredResources(filtered)
  }

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "slides":
        return <Presentation className="w-5 h-5" />
      case "pdf":
        return <FileText className="w-5 h-5" />
      case "link":
        return <LinkIcon className="w-5 h-5" />
      default:
        return <FileText className="w-5 h-5" />
    }
  }

  const getResourceColor = (type: string) => {
    switch (type) {
      case "slides":
        return "bg-gdg-blue text-white"
      case "pdf":
        return "bg-gdg-red text-white"
      case "link":
        return "bg-gdg-green text-white"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-gdg-yellow rounded-full flex items-center justify-center">
              <Archive className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Resources</h1>
          </div>
          <p className="text-gray-600">Access slides, PDFs, and session materials</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedType} onValueChange={handleTypeFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Resource type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="slides">Slides</SelectItem>
                <SelectItem value="pdf">PDFs</SelectItem>
                <SelectItem value="link">Links</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedDay} onValueChange={handleDayFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Select day" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Days</SelectItem>
                <SelectItem value="Day 1">Day 1</SelectItem>
                <SelectItem value="Day 2">Day 2</SelectItem>
                <SelectItem value="Day 3">Day 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <Card key={resource.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <Badge className={getResourceColor(resource.type)}>
                    <div className="flex items-center space-x-1">
                      {getResourceIcon(resource.type)}
                      <span className="capitalize">{resource.type}</span>
                    </div>
                  </Badge>
                  <Badge variant="outline">{resource.day}</Badge>
                </div>
                <CardTitle className="text-lg leading-tight">{resource.title}</CardTitle>
                <CardDescription>
                  <span className="font-medium">{resource.sessionTitle}</span>
                  <br />
                  <span className="text-sm">by {resource.speaker}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">{resource.description}</p>

                  <div className="text-xs text-gray-500">Added: {resource.uploadedAt.toLocaleDateString()}</div>

                  <div className="flex space-x-2">
                    {resource.type === "link" ? (
                      <Button
                        size="sm"
                        className="flex-1 bg-gdg-green hover:bg-green-600"
                        onClick={() => window.open(resource.url, "_blank")}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Open Link
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        className="flex-1 bg-gdg-blue hover:bg-blue-600"
                        onClick={() => {
                          // Simulate download
                          const link = document.createElement("a")
                          link.href = resource.url
                          link.download = resource.title
                          link.click()
                        }}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      Share
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Archive className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Archive Notice */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Archive className="w-5 h-5 text-gdg-blue mt-0.5" />
            <div>
              <h3 className="font-medium text-gdg-blue">Archive Access</h3>
              <p className="text-sm text-blue-700 mt-1">
                All resources will remain available for 30 days after the event ends. Download important materials to
                keep them permanently.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
