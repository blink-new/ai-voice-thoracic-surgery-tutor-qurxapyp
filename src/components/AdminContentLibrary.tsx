import React, { useState, useEffect } from 'react'
import { blink } from '../blink/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Label } from './ui/label'
import { Trash2, Edit, Plus, Upload, FileText, Image, Video, Music, FileIcon } from 'lucide-react'
import { useToast } from '../hooks/use-toast'

interface ContentItem {
  id: string
  title: string
  content_type: 'text' | 'image' | 'audio' | 'video' | 'pdf'
  content: string
  description?: string
  tags?: string
  category: string
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced'
  source?: string
  created_at: string
  is_active: boolean
}

interface QuestionTemplate {
  id: string
  content_id: string
  question_text: string
  question_type: 'multiple_choice' | 'open_ended' | 'case_based'
  correct_answer?: string
  answer_options?: string
  explanation: string
  learning_objectives?: string
}

interface AIPrompt {
  id: string
  prompt_type: 'question_generation' | 'answer_evaluation' | 'feedback' | 'case_scenario'
  content: string
  context_tags?: string
  is_active: boolean
}

const DEVELOPER_EMAIL = 'kai.jiabo.feng@gmail.com' // Replace with your email

export default function AdminContentLibrary() {
  const [user, setUser] = useState<any>(null)
  const [contentItems, setContentItems] = useState<ContentItem[]>([])
  const [questionTemplates, setQuestionTemplates] = useState<QuestionTemplate[]>([])
  const [aiPrompts, setAIPrompts] = useState<AIPrompt[]>([])
  const [isAddingContent, setIsAddingContent] = useState(false)
  const [isAddingQuestion, setIsAddingQuestion] = useState(false)
  const [selectedContentId, setSelectedContentId] = useState<string>('')
  const [editingPrompt, setEditingPrompt] = useState<AIPrompt | null>(null)
  const { toast } = useToast()

  // Form states
  const [contentForm, setContentForm] = useState({
    title: '',
    content_type: 'text' as ContentItem['content_type'],
    content: '',
    description: '',
    tags: '',
    category: '',
    difficulty_level: 'intermediate' as ContentItem['difficulty_level'],
    source: ''
  })

  const [questionForm, setQuestionForm] = useState({
    content_id: '',
    question_text: '',
    question_type: 'multiple_choice' as QuestionTemplate['question_type'],
    correct_answer: '',
    answer_options: '',
    explanation: '',
    learning_objectives: ''
  })

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
    })
    return unsubscribe
  }, [])

  const isDeveloper = () => {
    return user?.email === DEVELOPER_EMAIL
  }

  const loadContentLibrary = async () => {
    try {
      const items = await blink.db.content_library.list({
        orderBy: { created_at: 'desc' }
      })
      setContentItems(items)
    } catch (error) {
      console.error('Error loading content library:', error)
    }
  }

  const loadQuestionTemplates = async () => {
    try {
      const templates = await blink.db.question_templates.list({
        orderBy: { created_at: 'desc' }
      })
      setQuestionTemplates(templates)
    } catch (error) {
      console.error('Error loading question templates:', error)
    }
  }

  const loadAIPrompts = async () => {
    try {
      const prompts = await blink.db.ai_tutor_prompts.list({
        orderBy: { created_at: 'desc' }
      })
      setAIPrompts(prompts)
    } catch (error) {
      console.error('Error loading AI prompts:', error)
    }
  }

  useEffect(() => {
    if (user && user.email === DEVELOPER_EMAIL) {
      loadContentLibrary()
      loadQuestionTemplates()
      loadAIPrompts()
    }
  }, [user])

  const handleAddContent = async () => {
    try {
      const newContent = {
        id: `content_${Date.now()}`,
        ...contentForm,
        tags: contentForm.tags ? JSON.stringify(contentForm.tags.split(',').map(t => t.trim())) : '[]'
      }

      await blink.db.content_library.create(newContent)
      await loadContentLibrary()
      setIsAddingContent(false)
      setContentForm({
        title: '',
        content_type: 'text',
        content: '',
        description: '',
        tags: '',
        category: '',
        difficulty_level: 'intermediate',
        source: ''
      })
      toast({
        title: "Content Added",
        description: "New content has been added to the library."
      })
    } catch (error) {
      console.error('Error adding content:', error)
      toast({
        title: "Error",
        description: "Failed to add content.",
        variant: "destructive"
      })
    }
  }

  const handleAddQuestion = async () => {
    try {
      const newQuestion = {
        id: `question_${Date.now()}`,
        ...questionForm,
        answer_options: questionForm.answer_options ? JSON.stringify(questionForm.answer_options.split('\n').filter(o => o.trim())) : null,
        learning_objectives: questionForm.learning_objectives ? JSON.stringify(questionForm.learning_objectives.split(',').map(o => o.trim())) : null
      }

      await blink.db.question_templates.create(newQuestion)
      await loadQuestionTemplates()
      setIsAddingQuestion(false)
      setQuestionForm({
        content_id: '',
        question_text: '',
        question_type: 'multiple_choice',
        correct_answer: '',
        answer_options: '',
        explanation: '',
        learning_objectives: ''
      })
      toast({
        title: "Question Added",
        description: "New question template has been created."
      })
    } catch (error) {
      console.error('Error adding question:', error)
      toast({
        title: "Error",
        description: "Failed to add question.",
        variant: "destructive"
      })
    }
  }

  const handleUpdatePrompt = async (prompt: AIPrompt) => {
    try {
      await blink.db.ai_tutor_prompts.update(prompt.id, {
        content: prompt.content,
        context_tags: prompt.context_tags,
        is_active: prompt.is_active
      })
      await loadAIPrompts()
      setEditingPrompt(null)
      toast({
        title: "Prompt Updated",
        description: "AI tutor prompt has been updated."
      })
    } catch (error) {
      console.error('Error updating prompt:', error)
      toast({
        title: "Error",
        description: "Failed to update prompt.",
        variant: "destructive"
      })
    }
  }

  const handleDeleteContent = async (id: string) => {
    try {
      await blink.db.content_library.delete(id)
      await loadContentLibrary()
      toast({
        title: "Content Deleted",
        description: "Content has been removed from the library."
      })
    } catch (error) {
      console.error('Error deleting content:', error)
      toast({
        title: "Error",
        description: "Failed to delete content.",
        variant: "destructive"
      })
    }
  }

  const handleFileUpload = async (file: File) => {
    try {
      const { publicUrl } = await blink.storage.upload(file, `content-library/${file.name}`, { upsert: true })
      setContentForm(prev => ({ ...prev, content: publicUrl }))
      toast({
        title: "File Uploaded",
        description: "File has been uploaded successfully."
      })
    } catch (error) {
      console.error('Error uploading file:', error)
      toast({
        title: "Error",
        description: "Failed to upload file.",
        variant: "destructive"
      })
    }
  }

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'text': return <FileText className="h-4 w-4" />
      case 'image': return <Image className="h-4 w-4" />
      case 'video': return <Video className="h-4 w-4" />
      case 'audio': return <Music className="h-4 w-4" />
      case 'pdf': return <FileIcon className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
          <p className="text-gray-600">Please sign in to access the admin panel.</p>
        </div>
      </div>
    )
  }

  if (!isDeveloper()) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p className="text-gray-600">This area is restricted to developers only.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Library Admin</h1>
        <p className="text-gray-600">Manage educational content, questions, and AI tutor prompts</p>
      </div>

      <Tabs defaultValue="content" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content">Content Library</TabsTrigger>
          <TabsTrigger value="questions">Question Templates</TabsTrigger>
          <TabsTrigger value="prompts">AI Prompts</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Content Library ({contentItems.length})</h2>
            <Dialog open={isAddingContent} onOpenChange={setIsAddingContent}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Content
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Content</DialogTitle>
                  <DialogDescription>
                    Add educational content that the AI tutor can reference
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={contentForm.title}
                      onChange={(e) => setContentForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Content title"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="content_type">Content Type</Label>
                      <Select value={contentForm.content_type} onValueChange={(value: any) => setContentForm(prev => ({ ...prev, content_type: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Text</SelectItem>
                          <SelectItem value="image">Image</SelectItem>
                          <SelectItem value="audio">Audio</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                          <SelectItem value="pdf">PDF</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        value={contentForm.category}
                        onChange={(e) => setContentForm(prev => ({ ...prev, category: e.target.value }))}
                        placeholder="e.g., anatomy, procedures"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="content">Content</Label>
                    {contentForm.content_type === 'text' ? (
                      <Textarea
                        id="content"
                        value={contentForm.content}
                        onChange={(e) => setContentForm(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="Enter text content"
                        rows={6}
                      />
                    ) : (
                      <div className="space-y-2">
                        <Input
                          value={contentForm.content}
                          onChange={(e) => setContentForm(prev => ({ ...prev, content: e.target.value }))}
                          placeholder="File URL or upload below"
                        />
                        <div className="flex items-center space-x-2">
                          <input
                            type="file"
                            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                            className="hidden"
                            id="file-upload"
                          />
                          <Button variant="outline" onClick={() => document.getElementById('file-upload')?.click()}>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload File
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={contentForm.description}
                      onChange={(e) => setContentForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Brief description"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="difficulty">Difficulty Level</Label>
                      <Select value={contentForm.difficulty_level} onValueChange={(value: any) => setContentForm(prev => ({ ...prev, difficulty_level: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="source">Source</Label>
                      <Input
                        id="source"
                        value={contentForm.source}
                        onChange={(e) => setContentForm(prev => ({ ...prev, source: e.target.value }))}
                        placeholder="e.g., NICE Guidelines"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      value={contentForm.tags}
                      onChange={(e) => setContentForm(prev => ({ ...prev, tags: e.target.value }))}
                      placeholder="thoracic, surgery, anatomy"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddingContent(false)}>Cancel</Button>
                    <Button onClick={handleAddContent}>Add Content</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {contentItems.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {getContentIcon(item.content_type)}
                      <div>
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        <CardDescription>{item.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">{item.category}</Badge>
                      <Badge variant="outline">{item.difficulty_level}</Badge>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteContent(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {item.content_type === 'text' ? (
                      <p className="text-sm text-gray-600 line-clamp-3">{item.content}</p>
                    ) : (
                      <p className="text-sm text-blue-600">{item.content}</p>
                    )}
                    {item.source && <p className="text-xs text-gray-500">Source: {item.source}</p>}
                    {item.tags && (
                      <div className="flex flex-wrap gap-1">
                        {JSON.parse(item.tags).map((tag: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="questions" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Question Templates ({questionTemplates.length})</h2>
            <Dialog open={isAddingQuestion} onOpenChange={setIsAddingQuestion}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Question
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add Question Template</DialogTitle>
                  <DialogDescription>
                    Create a question template based on content
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="content_id">Based on Content</Label>
                    <Select value={questionForm.content_id} onValueChange={(value) => setQuestionForm(prev => ({ ...prev, content_id: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select content" />
                      </SelectTrigger>
                      <SelectContent>
                        {contentItems.map((item) => (
                          <SelectItem key={item.id} value={item.id}>{item.title}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="question_text">Question</Label>
                    <Textarea
                      id="question_text"
                      value={questionForm.question_text}
                      onChange={(e) => setQuestionForm(prev => ({ ...prev, question_text: e.target.value }))}
                      placeholder="Enter the question"
                    />
                  </div>
                  <div>
                    <Label htmlFor="question_type">Question Type</Label>
                    <Select value={questionForm.question_type} onValueChange={(value: any) => setQuestionForm(prev => ({ ...prev, question_type: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                        <SelectItem value="open_ended">Open Ended</SelectItem>
                        <SelectItem value="case_based">Case Based</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {questionForm.question_type === 'multiple_choice' && (
                    <div>
                      <Label htmlFor="answer_options">Answer Options (one per line)</Label>
                      <Textarea
                        id="answer_options"
                        value={questionForm.answer_options}
                        onChange={(e) => setQuestionForm(prev => ({ ...prev, answer_options: e.target.value }))}
                        placeholder="Option A&#10;Option B&#10;Option C&#10;Option D"
                      />
                    </div>
                  )}
                  <div>
                    <Label htmlFor="correct_answer">Correct Answer</Label>
                    <Input
                      id="correct_answer"
                      value={questionForm.correct_answer}
                      onChange={(e) => setQuestionForm(prev => ({ ...prev, correct_answer: e.target.value }))}
                      placeholder="The correct answer"
                    />
                  </div>
                  <div>
                    <Label htmlFor="explanation">Explanation</Label>
                    <Textarea
                      id="explanation"
                      value={questionForm.explanation}
                      onChange={(e) => setQuestionForm(prev => ({ ...prev, explanation: e.target.value }))}
                      placeholder="Explain why this is the correct answer"
                    />
                  </div>
                  <div>
                    <Label htmlFor="learning_objectives">Learning Objectives (comma-separated)</Label>
                    <Input
                      id="learning_objectives"
                      value={questionForm.learning_objectives}
                      onChange={(e) => setQuestionForm(prev => ({ ...prev, learning_objectives: e.target.value }))}
                      placeholder="objective1, objective2, objective3"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddingQuestion(false)}>Cancel</Button>
                    <Button onClick={handleAddQuestion}>Add Question</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {questionTemplates.map((question) => {
              const relatedContent = contentItems.find(c => c.id === question.content_id)
              return (
                <Card key={question.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{question.question_text}</CardTitle>
                        <CardDescription>
                          Based on: {relatedContent?.title || 'Unknown Content'}
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">{question.question_type}</Badge>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm"><strong>Correct Answer:</strong> {question.correct_answer}</p>
                      <p className="text-sm text-gray-600">{question.explanation}</p>
                      {question.answer_options && (
                        <div className="text-sm">
                          <strong>Options:</strong>
                          <ul className="list-disc list-inside ml-2">
                            {JSON.parse(question.answer_options).map((option: string, index: number) => (
                              <li key={index}>{option}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="prompts" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">AI Tutor Prompts ({aiPrompts.length})</h2>
          </div>

          <div className="grid gap-4">
            {aiPrompts.map((prompt) => (
              <Card key={prompt.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg capitalize">{prompt.prompt_type.replace('_', ' ')}</CardTitle>
                      <CardDescription>
                        {prompt.context_tags && JSON.parse(prompt.context_tags).join(', ')}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={prompt.is_active ? "default" : "secondary"}>
                        {prompt.is_active ? "Active" : "Inactive"}
                      </Badge>
                      <Button variant="ghost" size="sm" onClick={() => setEditingPrompt(prompt)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">{prompt.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {editingPrompt && (
            <Dialog open={!!editingPrompt} onOpenChange={() => setEditingPrompt(null)}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Edit AI Prompt</DialogTitle>
                  <DialogDescription>
                    Modify the AI tutor prompt for {editingPrompt.prompt_type.replace('_', ' ')}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="prompt_content">Prompt Content</Label>
                    <Textarea
                      id="prompt_content"
                      value={editingPrompt.content}
                      onChange={(e) => setEditingPrompt(prev => prev ? { ...prev, content: e.target.value } : null)}
                      rows={8}
                    />
                  </div>
                  <div>
                    <Label htmlFor="context_tags">Context Tags (comma-separated)</Label>
                    <Input
                      id="context_tags"
                      value={editingPrompt.context_tags ? JSON.parse(editingPrompt.context_tags).join(', ') : ''}
                      onChange={(e) => setEditingPrompt(prev => prev ? { 
                        ...prev, 
                        context_tags: JSON.stringify(e.target.value.split(',').map(t => t.trim()).filter(t => t))
                      } : null)}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={editingPrompt.is_active}
                      onChange={(e) => setEditingPrompt(prev => prev ? { ...prev, is_active: e.target.checked } : null)}
                    />
                    <Label htmlFor="is_active">Active</Label>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setEditingPrompt(null)}>Cancel</Button>
                    <Button onClick={() => editingPrompt && handleUpdatePrompt(editingPrompt)}>Update Prompt</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}