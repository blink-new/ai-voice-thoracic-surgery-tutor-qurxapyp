import { useState, useEffect } from 'react'
import { blink } from './blink/client'
import { useVoiceRecording } from './hooks/useVoiceRecording'
import { flashcards, caseStudies, knowledgeAreas, type FlashCard, type CaseStudy } from './data/medicalContent'
import { Sidebar, SidebarContent, SidebarProvider, SidebarTrigger } from './components/ui/sidebar'
import { Button } from './components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Badge } from './components/ui/badge'
import { Progress } from './components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar'
import { Alert, AlertDescription } from './components/ui/alert'
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  Volume2, 
  BookOpen, 
  Brain, 
  Target, 
  TrendingUp,
  Stethoscope,
  Heart,
  Activity,
  Users,
  Clock,
  Award,
  ChevronRight,
  Zap,
  AlertCircle,
  CheckCircle,
  RotateCcw,
  Shield
} from 'lucide-react'
import AdminContentLibrary from './components/AdminContentLibrary'

interface User {
  id: string
  email: string
  displayName?: string
}

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const [currentModule, setCurrentModule] = useState('dashboard')

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-medical-gray">Loading your medical tutor...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
              <Stethoscope className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">AI Thoracic Surgery Tutor</CardTitle>
            <CardDescription>
              Your voice-first medical education companion
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => blink.auth.login()} 
              className="w-full"
              size="lg"
            >
              Sign In to Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-blue-50 to-indigo-100">
        <Sidebar className="border-r border-border/50">
          <SidebarContent className="p-4">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Stethoscope className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold text-lg">AI Surgery Tutor</h2>
                  <p className="text-sm text-muted-foreground">Thoracic Surgery</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-card rounded-lg border">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {user.displayName?.[0] || user.email[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    {user.displayName || user.email}
                  </p>
                  <p className="text-xs text-muted-foreground">Medical Student</p>
                </div>
              </div>
            </div>

            <nav className="space-y-2">
              <Button
                variant={currentModule === 'dashboard' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setCurrentModule('dashboard')}
              >
                <Activity className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <Button
                variant={currentModule === 'voice-session' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setCurrentModule('voice-session')}
              >
                <Mic className="h-4 w-4 mr-2" />
                Voice Session
              </Button>
              <Button
                variant={currentModule === 'cases' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setCurrentModule('cases')}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Case Studies
              </Button>
              <Button
                variant={currentModule === 'progress' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setCurrentModule('progress')}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Progress
              </Button>
              <Button
                variant={currentModule === 'flashcards' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setCurrentModule('flashcards')}
              >
                <Brain className="h-4 w-4 mr-2" />
                Flashcards
              </Button>
              
              {user?.email === 'kai.jiabo.feng@gmail.com' && (
                <Button
                  variant={currentModule === 'admin' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setCurrentModule('admin')}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Admin Panel
                </Button>
              )}
            </nav>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <SidebarTrigger />
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  {currentModule === 'dashboard' && 'Dashboard'}
                  {currentModule === 'voice-session' && 'Voice Session'}
                  {currentModule === 'cases' && 'Case Studies'}
                  {currentModule === 'progress' && 'Progress Tracking'}
                  {currentModule === 'flashcards' && 'Flashcards'}
                  {currentModule === 'admin' && 'Admin Panel'}
                </h1>
                <p className="text-muted-foreground">
                  {currentModule === 'dashboard' && 'Your learning overview and recommendations'}
                  {currentModule === 'voice-session' && 'Interactive AI-powered learning session'}
                  {currentModule === 'cases' && 'Practice with real thoracic surgery scenarios'}
                  {currentModule === 'progress' && 'Track your learning journey and identify gaps'}
                  {currentModule === 'flashcards' && 'Spaced repetition for key concepts'}
                  {currentModule === 'admin' && 'Manage content library and AI tutor settings'}
                </p>
              </div>
            </div>

            {currentModule === 'dashboard' && <DashboardView />}
            {currentModule === 'voice-session' && <VoiceSessionView isRecording={isRecording} setIsRecording={setIsRecording} />}
            {currentModule === 'cases' && <CaseStudiesView />}
            {currentModule === 'progress' && <ProgressView />}
            {currentModule === 'flashcards' && <FlashcardsView />}
            {currentModule === 'admin' && <AdminContentLibrary />}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

function DashboardView() {
  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Study Streak</p>
                <p className="text-2xl font-bold">12 days</p>
              </div>
              <div className="p-2 bg-accent/10 rounded-lg">
                <Zap className="h-5 w-5 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cases Completed</p>
                <p className="text-2xl font-bold">47</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Knowledge Score</p>
                <p className="text-2xl font-bold">87%</p>
              </div>
              <div className="p-2 bg-accent/10 rounded-lg">
                <Target className="h-5 w-5 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Study Time</p>
                <p className="text-2xl font-bold">24h</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg">
                <Clock className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommended Modules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Recommended for You
          </CardTitle>
          <CardDescription>
            Based on your progress and knowledge gaps
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Pneumothorax Management</h3>
                <Badge variant="secondary">High Priority</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Emergency procedures and decision-making protocols
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  15 min
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            
            <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">VATS Procedures</h3>
                <Badge variant="outline">Medium Priority</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Video-assisted thoracoscopic surgery techniques
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  20 min
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Award className="h-4 w-4 text-accent" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Completed: Chest Tube Insertion Case</p>
                <p className="text-sm text-muted-foreground">Score: 92% • 2 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Brain className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Reviewed 15 flashcards</p>
                <p className="text-sm text-muted-foreground">Pulmonary Anatomy • 4 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Mic className="h-4 w-4 text-accent" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Voice session completed</p>
                <p className="text-sm text-muted-foreground">Thoracotomy Approaches • Yesterday</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function VoiceSessionView({ isRecording, setIsRecording }: { isRecording: boolean, setIsRecording: (recording: boolean) => void }) {
  const [aiResponse, setAiResponse] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [sessionTopic, setSessionTopic] = useState('Emergency Thoracotomy')
  const [conceptsLearned, setConceptsLearned] = useState(['Indications', 'Contraindications', 'Technique'])
  
  const { 
    isRecording: voiceIsRecording, 
    transcript, 
    startRecording, 
    stopRecording, 
    clearTranscript,
    isSupported 
  } = useVoiceRecording()

  const toggleRecording = async () => {
    if (voiceIsRecording) {
      stopRecording()
      setIsRecording(false)
      
      if (transcript.trim()) {
        setIsProcessing(true)
        try {
          // Get relevant content from library
          const contentLibrary = await blink.db.content_library.list({
            where: { is_active: true },
            limit: 10
          })
          
          // Get AI tutor prompts
          const aiPrompts = await blink.db.ai_tutor_prompts.list({
            where: { 
              prompt_type: 'question_generation',
              is_active: true
            },
            limit: 1
          })
          
          const basePrompt = aiPrompts.length > 0 ? aiPrompts[0].content : 
            'You are a senior thoracic surgery consultant providing medical education.'
          
          // Find relevant content based on the question
          const relevantContent = contentLibrary.filter(item => {
            const tags = item.tags ? JSON.parse(item.tags) : []
            const searchTerms = transcript.toLowerCase()
            return (
              item.title.toLowerCase().includes(searchTerms) ||
              item.description?.toLowerCase().includes(searchTerms) ||
              item.category.toLowerCase().includes(searchTerms) ||
              tags.some((tag: string) => searchTerms.includes(tag.toLowerCase()))
            )
          })
          
          let contextualInfo = ''
          if (relevantContent.length > 0) {
            contextualInfo = `\n\nRelevant educational content from the library:\n${relevantContent.map(item => 
              `- ${item.title}: ${item.content_type === 'text' ? item.content.substring(0, 200) + '...' : item.description || 'Media content available'}`
            ).join('\n')}`
          }
          
          // Generate AI response using Blink AI with library content
          const response = await blink.ai.generateText({
            prompt: `You are a senior thoracic surgery consultant providing medical education. A medical student/resident asked: "${transcript}". 

Provide a comprehensive, educational response that:
1. Directly answers their question
2. Includes relevant clinical guidelines (NICE, BTS, ISCP)
3. Provides evidence-based information
4. Uses appropriate medical terminology
5. Includes practical clinical pearls
6. References the provided educational content when relevant
7. Keeps the tone professional but approachable

Focus on thoracic surgery topics including emergency procedures, VATS techniques, lung cancer management, chest trauma, and post-operative care.${contextualInfo}`,
            maxTokens: 600
          })
          
          setAiResponse(response.text)
          
          // Save session to database
          await blink.db.voiceSessions.create({
            id: `session_${Date.now()}`,
            userId: (await blink.auth.me()).id,
            topic: sessionTopic,
            transcript: transcript,
            aiResponse: response.text,
            sessionDuration: 0
          })
          
        } catch (error) {
          console.error('Error generating AI response:', error)
          setAiResponse('I apologize, but I encountered an error processing your question. Please try again.')
        } finally {
          setIsProcessing(false)
        }
      }
    } else {
      clearTranscript()
      setAiResponse('')
      startRecording()
      setIsRecording(true)
    }
  }

  const togglePlayback = () => {
    setIsPlaying(!isPlaying)
    if (!isPlaying && aiResponse) {
      // Simulate text-to-speech (in a real app, you'd use Web Speech API or similar)
      const utterance = new SpeechSynthesisUtterance(aiResponse)
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.onend = () => setIsPlaying(false)
      speechSynthesis.speak(utterance)
    } else {
      speechSynthesis.cancel()
    }
  }

  return (
    <div className="space-y-6">
      {/* AI Assistant */}
      <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="h-16 w-16 border-2 border-primary/20">
              <AvatarFallback className="bg-primary/10 text-primary text-xl">
                AI
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold">Dr. AI Assistant</h3>
              <p className="text-muted-foreground">Senior Thoracic Surgery Consultant</p>
              <Badge variant="secondary" className="mt-1">
                <div className="w-2 h-2 bg-accent rounded-full mr-2 animate-pulse"></div>
                Ready to help
              </Badge>
            </div>
          </div>
          
          {/* Voice Waveform Visualization */}
          <div className="bg-card rounded-lg p-4 mb-4">
            {!isSupported && (
              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Voice recognition is not supported in your browser. Please use Chrome, Edge, or Safari for the best experience.
                </AlertDescription>
              </Alert>
            )}
            
            <div className="flex items-center justify-center h-20">
              {voiceIsRecording ? (
                <div className="flex items-center gap-1">
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-primary rounded-full animate-pulse"
                      style={{
                        height: `${Math.random() * 40 + 10}px`,
                        animationDelay: `${i * 0.1}s`
                      }}
                    />
                  ))}
                </div>
              ) : isProcessing ? (
                <div className="text-center text-primary">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p>Processing your question...</p>
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  <Mic className="h-8 w-8 mx-auto mb-2" />
                  <p>Click to start voice interaction</p>
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <Button
              size="lg"
              variant={voiceIsRecording ? "destructive" : "default"}
              onClick={toggleRecording}
              className="rounded-full h-16 w-16"
              disabled={!isSupported || isProcessing}
            >
              {voiceIsRecording ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              onClick={togglePlayback}
              className="rounded-full h-16 w-16"
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              className="rounded-full h-16 w-16"
            >
              <Volume2 className="h-6 w-6" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transcript and Response */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Question</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/50 rounded-lg p-4 min-h-[200px]">
              {transcript ? (
                <p className="text-sm leading-relaxed">{transcript}</p>
              ) : (
                <p className="text-muted-foreground text-sm">Your voice input will appear here...</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">AI Response</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-primary/5 rounded-lg p-4 min-h-[200px]">
              {aiResponse ? (
                <p className="text-sm leading-relaxed">{aiResponse}</p>
              ) : (
                <p className="text-muted-foreground text-sm">AI response will appear here...</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Session Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Session Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Current Topic: Emergency Thoracotomy</span>
                <span>Progress: 3/8 concepts</span>
              </div>
              <Progress value={37.5} className="h-2" />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Badge variant="default">Indications</Badge>
              <Badge variant="default">Contraindications</Badge>
              <Badge variant="default">Technique</Badge>
              <Badge variant="outline">Complications</Badge>
              <Badge variant="outline">Post-op Care</Badge>
              <Badge variant="outline">Evidence Base</Badge>
              <Badge variant="outline">Guidelines</Badge>
              <Badge variant="outline">Case Studies</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function CaseStudiesView() {
  const [selectedCase, setSelectedCase] = useState<CaseStudy | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [userAnswers, setUserAnswers] = useState<number[]>([])
  const [showResults, setShowResults] = useState(false)
  const [completedCases, setCompletedCases] = useState<string[]>(['case2', 'case3'])

  const startCase = (caseStudy: CaseStudy) => {
    setSelectedCase(caseStudy)
    setCurrentQuestion(0)
    setUserAnswers([])
    setShowResults(false)
  }

  const selectAnswer = (answerIndex: number) => {
    const newAnswers = [...userAnswers]
    newAnswers[currentQuestion] = answerIndex
    setUserAnswers(newAnswers)
  }

  const finishCase = async () => {
    if (!selectedCase) return
    
    const correctAnswers = userAnswers.filter((answer, index) => 
      answer === selectedCase.questions[index].correctAnswer
    ).length
    
    const score = Math.round((correctAnswers / selectedCase.questions.length) * 100)
    
    try {
      const user = await blink.auth.me()
      await blink.db.caseCompletions.create({
        id: `completion_${Date.now()}`,
        userId: user.id,
        caseId: selectedCase.id,
        score: score,
        timeTaken: 0, // In a real app, you'd track this
        completedAt: new Date().toISOString()
      })
      
      setCompletedCases(prev => [...prev, selectedCase.id])
    } catch (error) {
      console.error('Error saving case completion:', error)
    }
    
    setShowResults(true)
  }

  const nextQuestion = () => {
    if (currentQuestion < selectedCase!.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      finishCase()
    }
  }

  const getCaseScore = (caseId: string) => {
    // Mock scores for demo
    const scores: Record<string, number> = {
      'case2': 89,
      'case3': 94
    }
    return scores[caseId]
  }

  if (selectedCase && !showResults) {
    const question = selectedCase.questions[currentQuestion]
    
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => setSelectedCase(null)}>
            ← Back to Cases
          </Button>
          <Badge variant="outline">
            Question {currentQuestion + 1} of {selectedCase.questions.length}
          </Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{selectedCase.title}</CardTitle>
            <CardDescription>{selectedCase.scenario}</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{question.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {question.options.map((option, index) => (
              <Button
                key={index}
                variant={userAnswers[currentQuestion] === index ? "default" : "outline"}
                className="w-full text-left justify-start h-auto p-4"
                onClick={() => selectAnswer(index)}
              >
                <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                {option}
              </Button>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          <Button 
            onClick={nextQuestion}
            disabled={userAnswers[currentQuestion] === undefined}
          >
            {currentQuestion === selectedCase.questions.length - 1 ? 'Finish Case' : 'Next Question'}
          </Button>
        </div>
      </div>
    )
  }

  if (selectedCase && showResults) {
    const correctAnswers = userAnswers.filter((answer, index) => 
      answer === selectedCase.questions[index].correctAnswer
    ).length
    const score = Math.round((correctAnswers / selectedCase.questions.length) * 100)

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <div className="mb-4">
            {score >= 80 ? (
              <CheckCircle className="h-16 w-16 text-accent mx-auto" />
            ) : (
              <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto" />
            )}
          </div>
          <h2 className="text-3xl font-bold mb-2">Case Complete!</h2>
          <p className="text-xl text-muted-foreground">
            You scored {score}% ({correctAnswers}/{selectedCase.questions.length} correct)
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Review Your Answers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {selectedCase.questions.map((question, index) => (
              <div key={index} className="border-b pb-4 last:border-b-0">
                <h4 className="font-semibold mb-2">{question.question}</h4>
                <div className="space-y-2">
                  {question.options.map((option, optionIndex) => (
                    <div 
                      key={optionIndex}
                      className={`p-2 rounded ${
                        optionIndex === question.correctAnswer 
                          ? 'bg-accent/10 border border-accent' 
                          : userAnswers[index] === optionIndex && optionIndex !== question.correctAnswer
                          ? 'bg-destructive/10 border border-destructive'
                          : 'bg-muted/50'
                      }`}
                    >
                      <span className="font-medium mr-2">{String.fromCharCode(65 + optionIndex)}.</span>
                      {option}
                      {optionIndex === question.correctAnswer && (
                        <CheckCircle className="h-4 w-4 text-accent inline ml-2" />
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-2 italic">
                  {question.explanation}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-center gap-4">
          <Button onClick={() => setSelectedCase(null)}>
            Back to Cases
          </Button>
          <Button variant="outline" onClick={() => startCase(selectedCase)}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Retry Case
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {caseStudies.map((caseStudy) => (
          <Card key={caseStudy.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge variant={caseStudy.difficulty === 'Beginner' ? 'secondary' : caseStudy.difficulty === 'Intermediate' ? 'default' : 'destructive'}>
                  {caseStudy.difficulty}
                </Badge>
                {completedCases.includes(caseStudy.id) && (
                  <Badge variant="outline" className="text-accent">
                    <Award className="h-3 w-3 mr-1" />
                    {getCaseScore(caseStudy.id)}%
                  </Badge>
                )}
              </div>
              <CardTitle className="text-lg">{caseStudy.title}</CardTitle>
              <CardDescription>{caseStudy.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {caseStudy.duration}
                </div>
                <Button size="sm" onClick={() => startCase(caseStudy)}>
                  {completedCases.includes(caseStudy.id) ? 'Review' : 'Start Case'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function ProgressView() {
  const [progressData, setProgressData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    casesCompleted: 2,
    hoursStudied: 24,
    currentStreak: 12,
    overallProgress: 87
  })

  useEffect(() => {
    const loadProgressData = async () => {
      try {
        const user = await blink.auth.me()
        
        // Load user progress from database
        const userProgress = await blink.db.userProgress.list({
          where: { userId: user.id }
        })
        
        // Initialize progress for all knowledge areas if not exists
        const existingAreas = userProgress.map(p => p.knowledgeArea)
        const missingAreas = knowledgeAreas.filter(area => !existingAreas.includes(area.name))
        
        for (const area of missingAreas) {
          await blink.db.userProgress.create({
            id: `progress_${area.name}_${Date.now()}`,
            userId: user.id,
            knowledgeArea: area.name,
            progressPercentage: Math.floor(Math.random() * 40) + 60, // Random initial progress 60-100%
            lastStudiedAt: new Date().toISOString()
          })
        }
        
        // Reload progress data
        const updatedProgress = await blink.db.userProgress.list({
          where: { userId: user.id }
        })
        
        setProgressData(updatedProgress)
        
      } catch (error) {
        console.error('Error loading progress data:', error)
        // Fallback to mock data
        setProgressData([
          { knowledgeArea: 'Emergency Procedures', progressPercentage: 92 },
          { knowledgeArea: 'VATS Techniques', progressPercentage: 78 },
          { knowledgeArea: 'Lung Cancer Management', progressPercentage: 85 },
          { knowledgeArea: 'Chest Trauma', progressPercentage: 65 },
          { knowledgeArea: 'Post-operative Care', progressPercentage: 71 }
        ])
      } finally {
        setLoading(false)
      }
    }
    
    loadProgressData()
  }, [])

  const getStatusFromProgress = (progress: number) => {
    if (progress >= 85) return { status: 'strong', variant: 'default' as const, label: 'Strong' }
    if (progress >= 70) return { status: 'good', variant: 'secondary' as const, label: 'Good' }
    return { status: 'needs-work', variant: 'destructive' as const, label: 'Needs Work' }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your progress...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Progress</CardTitle>
          <CardDescription>Your thoracic surgery knowledge development</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Knowledge Mastery</span>
                <span>{stats.overallProgress}%</span>
              </div>
              <Progress value={stats.overallProgress} className="h-3" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{stats.casesCompleted}</p>
                <p className="text-sm text-muted-foreground">Cases Completed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-accent">{stats.hoursStudied}</p>
                <p className="text-sm text-muted-foreground">Hours Studied</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{stats.currentStreak}</p>
                <p className="text-sm text-muted-foreground">Day Streak</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Knowledge Areas */}
      <Card>
        <CardHeader>
          <CardTitle>Knowledge Areas</CardTitle>
          <CardDescription>Detailed breakdown by topic</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {progressData.map((area) => {
              const { variant, label } = getStatusFromProgress(area.progressPercentage)
              return (
                <div key={area.knowledgeArea} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{area.knowledgeArea}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant={variant}>
                        {label}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{area.progressPercentage}%</span>
                    </div>
                  </div>
                  <Progress value={area.progressPercentage} className="h-2" />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Improvement Recommendations</CardTitle>
          <CardDescription>Focus areas to enhance your learning</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {progressData
              .filter(area => area.progressPercentage < 80)
              .sort((a, b) => a.progressPercentage - b.progressPercentage)
              .slice(0, 3)
              .map((area) => (
                <div key={area.knowledgeArea} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{area.knowledgeArea}</p>
                    <p className="text-sm text-muted-foreground">
                      Current: {area.progressPercentage}% • Target: 85%+
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    Study Now
                  </Button>
                </div>
              ))}
            {progressData.filter(area => area.progressPercentage < 80).length === 0 && (
              <div className="text-center py-4">
                <CheckCircle className="h-12 w-12 text-accent mx-auto mb-2" />
                <p className="font-medium">Excellent Progress!</p>
                <p className="text-sm text-muted-foreground">All knowledge areas are performing well.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function FlashcardsView() {
  const [currentCard, setCurrentCard] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [studiedToday, setStudiedToday] = useState(0)
  const [reviewedCards, setReviewedCards] = useState<string[]>([])

  const nextCard = () => {
    setShowAnswer(false)
    setCurrentCard((prev) => (prev + 1) % flashcards.length)
  }

  const prevCard = () => {
    setShowAnswer(false)
    setCurrentCard((prev) => (prev - 1 + flashcards.length) % flashcards.length)
  }

  const rateDifficulty = async (difficulty: 'easy' | 'medium' | 'hard') => {
    const card = flashcards[currentCard]
    
    try {
      const user = await blink.auth.me()
      
      // Calculate next review date based on spaced repetition
      const now = new Date()
      let nextReviewDays = 1
      
      switch (difficulty) {
        case 'easy':
          nextReviewDays = 7
          break
        case 'medium':
          nextReviewDays = 3
          break
        case 'hard':
          nextReviewDays = 1
          break
      }
      
      const nextReviewDate = new Date(now.getTime() + nextReviewDays * 24 * 60 * 60 * 1000)
      
      await blink.db.flashcardReviews.create({
        id: `review_${Date.now()}`,
        userId: user.id,
        flashcardId: card.id,
        difficultyRating: difficulty,
        reviewedAt: now.toISOString(),
        nextReviewAt: nextReviewDate.toISOString()
      })
      
      setReviewedCards(prev => [...prev, card.id])
      setStudiedToday(prev => prev + 1)
      
      // Auto-advance to next card
      setTimeout(() => {
        nextCard()
      }, 500)
      
    } catch (error) {
      console.error('Error saving flashcard review:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Flashcard */}
      <div className="max-w-2xl mx-auto">
        <Card className="min-h-[400px] cursor-pointer" onClick={() => setShowAnswer(!showAnswer)}>
          <CardContent className="p-8 flex flex-col justify-center h-full">
            <div className="text-center space-y-4">
              <Badge variant="outline" className="mb-4">
                Card {currentCard + 1} of {flashcards.length}
              </Badge>
              
              {!showAnswer ? (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Question</h3>
                  <p className="text-lg leading-relaxed">{flashcards[currentCard].question}</p>
                  <p className="text-sm text-muted-foreground mt-6">Click to reveal answer</p>
                </div>
              ) : (
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-accent">Answer</h3>
                  <p className="text-lg leading-relaxed">{flashcards[currentCard].answer}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        <div className="flex justify-center gap-4 mt-6">
          <Button variant="outline" onClick={prevCard}>
            Previous
          </Button>
          <Button onClick={() => setShowAnswer(!showAnswer)}>
            {showAnswer ? 'Show Question' : 'Show Answer'}
          </Button>
          <Button variant="outline" onClick={nextCard}>
            Next
          </Button>
        </div>

        {/* Difficulty Rating */}
        {showAnswer && (
          <Card className="mt-6">
            <CardContent className="p-4">
              <p className="text-center text-sm text-muted-foreground mb-3">
                How well did you know this?
              </p>
              <div className="flex justify-center gap-2">
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => rateDifficulty('hard')}
                  disabled={reviewedCards.includes(flashcards[currentCard].id)}
                >
                  Hard (1 day)
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => rateDifficulty('medium')}
                  disabled={reviewedCards.includes(flashcards[currentCard].id)}
                >
                  Medium (3 days)
                </Button>
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={() => rateDifficulty('easy')}
                  disabled={reviewedCards.includes(flashcards[currentCard].id)}
                >
                  Easy (7 days)
                </Button>
              </div>
              {reviewedCards.includes(flashcards[currentCard].id) && (
                <p className="text-center text-sm text-accent mt-2">
                  ✓ Reviewed! Moving to next card...
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Study Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">{studiedToday}</p>
            <p className="text-sm text-muted-foreground">Studied Today</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-accent">{flashcards.length - reviewedCards.length}</p>
            <p className="text-sm text-muted-foreground">Remaining</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">{Math.round((reviewedCards.length / flashcards.length) * 100)}%</p>
            <p className="text-sm text-muted-foreground">Progress</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default App