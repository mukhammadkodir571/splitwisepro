"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Users,
  Plus,
  Trash2,
  Calculator,
  PieChart,
  ArrowRightLeft,
  DollarSign,
  Download,
  Moon,
  Sun,
  LogIn,
  LogOut,
  Calendar,
  FileText,
  MessageSquare,
  Star,
  Shield,
  Key,
  Clock,
  UserPlus,
} from "lucide-react"

interface DailyExpense {
  id: string
  userId: string
  amount: number
  description: string
  category: string
  date: string
  createdAt: string
}

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "member"
  joinedAt: string
}

interface Group {
  id: string
  name: string
  description: string
  adminId: string
  accessCode: string
  users: User[]
  dailyExpenses: DailyExpense[]
  createdAt: string
}

interface Feedback {
  id: string
  userId: string
  userName: string
  message: string
  rating: number
  createdAt: string
}

interface AuthForm {
  name: string
  email: string
  accessCode: string
}

interface CreateGroupForm {
  name: string
  description: string
}

interface ExpenseForm {
  amount: string
  description: string
  category: string
  date: string
}

interface FeedbackForm {
  message: string
  rating: number
}

export default function SplitWiseProSimple() {
  // App state
  const [isStarted, setIsStarted] = useState(false)

  // Theme state
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [currentGroup, setCurrentGroup] = useState<Group | null>(null)
  const [authMode, setAuthMode] = useState<"login" | "signup">("login")
  const [authForm, setAuthForm] = useState<AuthForm>({
    name: "",
    email: "",
    accessCode: "",
  })

  // Create group state
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false)
  const [createGroupForm, setCreateGroupForm] = useState<CreateGroupForm>({
    name: "",
    description: "",
  })

  // App state
  const [groups, setGroups] = useState<Group[]>([])
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
  const [feedbackForm, setFeedbackForm] = useState<FeedbackForm>({ message: "", rating: 5 })

  // Daily expense form
  const [expenseForm, setExpenseForm] = useState<ExpenseForm>({
    amount: "",
    description: "",
    category: "Ovqat",
    date: new Date().toISOString().split("T")[0],
  })

  const categories = ["Ovqat", "Transport", "Ko'ngilochar", "Xarid", "Kommunal", "Dori", "Boshqa"]

  // Load data from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("splitwise-user")
    const savedGroups = localStorage.getItem("splitwise-groups")
    const savedCurrentGroup = localStorage.getItem("splitwise-current-group")
    const savedFeedbacks = localStorage.getItem("splitwise-feedbacks")
    const savedTheme = localStorage.getItem("splitwise-theme")
    const savedStarted = localStorage.getItem("splitwise-started")

    if (savedUser) setCurrentUser(JSON.parse(savedUser))
    if (savedGroups) setGroups(JSON.parse(savedGroups))
    if (savedCurrentGroup) setCurrentGroup(JSON.parse(savedCurrentGroup))
    if (savedFeedbacks) setFeedbacks(JSON.parse(savedFeedbacks))
    if (savedTheme) setIsDarkMode(savedTheme === "dark")
    if (savedStarted) setIsStarted(true)
  }, [])

  // Save data to localStorage
  useEffect(() => {
    if (currentUser) localStorage.setItem("splitwise-user", JSON.stringify(currentUser))
  }, [currentUser])

  useEffect(() => {
    localStorage.setItem("splitwise-groups", JSON.stringify(groups))
  }, [groups])

  useEffect(() => {
    if (currentGroup) localStorage.setItem("splitwise-current-group", JSON.stringify(currentGroup))
  }, [currentGroup])

  useEffect(() => {
    localStorage.setItem("splitwise-feedbacks", JSON.stringify(feedbacks))
  }, [feedbacks])

  useEffect(() => {
    if (isStarted) localStorage.setItem("splitwise-started", "true")
  }, [isStarted])

  // Apply theme
  useEffect(() => {
    localStorage.setItem("splitwise-theme", isDarkMode ? "dark" : "light")
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  // Handle start button click
  const handleStart = () => {
    setIsStarted(true)
  }

  // Generate access code
  const generateAccessCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  // Authentication functions
  const handleAuth = () => {
    if (!authForm.name || !authForm.email) return

    if (authMode === "signup") {
      // Agar hech qanday guruh yo'q bo'lsa, birinchi admin bo'lish imkonini berish
      if (groups.length === 0) {
        // Birinchi foydalanuvchi - avtomatik admin bo'ladi
        const newUser: User = {
          id: crypto.randomUUID(),
          name: authForm.name,
          email: authForm.email,
          role: "admin",
          joinedAt: new Date().toISOString(),
        }
        setCurrentUser(newUser)
        // Guruh yaratish oynasini ochish
        setIsCreateGroupOpen(true)
        return
      }

      // Agar guruhlar mavjud bo'lsa, access code talab qilish
      if (!authForm.accessCode) {
        alert("Access code kiritish majburiy!")
        return
      }

      const group = groups.find((g) => g.accessCode === authForm.accessCode.toUpperCase())
      if (!group) {
        alert("Noto'g'ri access code kiritildi!")
        return
      }

      // Check if user already exists in this group
      const existingUser = group.users.find((u) => u.email === authForm.email)
      if (existingUser) {
        alert("Bu email bilan foydalanuvchi allaqachon mavjud!")
        return
      }

      const newUser: User = {
        id: crypto.randomUUID(),
        name: authForm.name,
        email: authForm.email,
        role: "member",
        joinedAt: new Date().toISOString(),
      }

      const updatedGroup = {
        ...group,
        users: [...group.users, newUser],
      }

      setGroups(groups.map((g) => (g.id === group.id ? updatedGroup : g)))
      setCurrentUser(newUser)
      setCurrentGroup(updatedGroup)
    } else {
      // Login mode
      const existingUser = groups
        .flatMap((g) => g.users)
        .find((u) => u.email === authForm.email && u.name === authForm.name)

      if (existingUser) {
        setCurrentUser(existingUser)
        // Find user's group
        const userGroup = groups.find((g) => g.users.some((u) => u.id === existingUser.id))
        if (userGroup) setCurrentGroup(userGroup)
      } else {
        alert("Foydalanuvchi topilmadi! Avval ro'yxatdan o'ting.")
        return
      }
    }

    setAuthForm({ name: "", email: "", accessCode: "" })
  }

  // Create group function
  const handleCreateGroup = () => {
    if (!currentUser || !createGroupForm.name) return

    const newGroup: Group = {
      id: crypto.randomUUID(),
      name: createGroupForm.name,
      description: createGroupForm.description || "",
      adminId: currentUser.id,
      accessCode: generateAccessCode(),
      users: [{ ...currentUser, role: "admin" }],
      dailyExpenses: [],
      createdAt: new Date().toISOString(),
    }

    setGroups([...groups, newGroup])
    setCurrentGroup(newGroup)
    setCurrentUser({ ...currentUser, role: "admin" })
    setIsCreateGroupOpen(false)
    setCreateGroupForm({ name: "", description: "" })
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setCurrentGroup(null)
    setIsStarted(false)
    localStorage.removeItem("splitwise-user")
    localStorage.removeItem("splitwise-current-group")
    localStorage.removeItem("splitwise-started")
  }

  // Daily expense functions
  const addDailyExpense = () => {
    if (!currentUser || !currentGroup || !expenseForm.amount || !expenseForm.description) return

    const newExpense: DailyExpense = {
      id: crypto.randomUUID(),
      userId: currentUser.id,
      amount: Number.parseFloat(expenseForm.amount),
      description: expenseForm.description,
      category: expenseForm.category,
      date: expenseForm.date,
      createdAt: new Date().toISOString(),
    }

    const updatedGroup = {
      ...currentGroup,
      dailyExpenses: [...currentGroup.dailyExpenses, newExpense],
    }

    setCurrentGroup(updatedGroup)
    setGroups(groups.map((g) => (g.id === currentGroup.id ? updatedGroup : g)))
    setExpenseForm({
      amount: "",
      description: "",
      category: "Ovqat",
      date: new Date().toISOString().split("T")[0],
    })
  }

  const deleteDailyExpense = (expenseId: string) => {
    if (!currentGroup) return

    const updatedGroup = {
      ...currentGroup,
      dailyExpenses: currentGroup.dailyExpenses.filter((e) => e.id !== expenseId),
    }

    setCurrentGroup(updatedGroup)
    setGroups(groups.map((g) => (g.id === currentGroup.id ? updatedGroup : g)))
  }

  // Weekly settlement calculation
  const calculateWeeklySettlement = () => {
    if (!currentGroup) return { matrix: [], spent: {}, stats: null }

    const users = currentGroup.users
    const expenses = currentGroup.dailyExpenses

    // Calculate spent amounts
    const spent = users.reduce((acc, user) => ({ ...acc, [user.name]: 0 }), {} as Record<string, number>)
    expenses.forEach((expense) => {
      const user = users.find((u) => u.id === expense.userId)
      if (user) {
        spent[user.name] += expense.amount
      }
    })

    // Calculate matrix
    const n = users.length
    const matrix = users.map((rowUser) =>
      users.map((colUser) => {
        const cell = (spent[colUser.name] || 0) / n - (spent[rowUser.name] || 0) / n
        return Math.round(cell * 10) / 10
      }),
    )

    // Calculate stats
    const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0)
    const averagePerPerson = totalSpent / users.length

    return {
      matrix,
      spent,
      stats: {
        totalSpent,
        averagePerPerson,
      },
    }
  }

  // Feedback functions
  const submitFeedback = () => {
    if (!currentUser || !feedbackForm.message) return

    const newFeedback: Feedback = {
      id: crypto.randomUUID(),
      userId: currentUser.id,
      userName: currentUser.name,
      message: feedbackForm.message,
      rating: feedbackForm.rating,
      createdAt: new Date().toISOString(),
    }

    setFeedbacks([...feedbacks, newFeedback])
    setFeedbackForm({ message: "", rating: 5 })
    setIsFeedbackOpen(false)
    alert("Fikr-mulohaza yuborildi! Rahmat!")
  }

  // PDF Export with improved formatting
  const exportToPDF = async () => {
    if (!currentGroup) return

    const { matrix, stats } = calculateWeeklySettlement()
    if (!stats || stats.totalSpent === 0) return

    try {
      const jsPDF = (await import("jspdf")).default
      const doc = new jsPDF()

      // Header
      doc.setFontSize(20)
      doc.text("SplitWise Pro - Haftalik Hisob-kitob", 20, 30)

      doc.setFontSize(12)
      doc.text(`Guruh: ${currentGroup.name}`, 20, 45)
      doc.text(`Sana: ${new Date().toLocaleDateString("uz-UZ")}`, 20, 55)
      doc.text(`A'zolar: ${currentGroup.users.map((u) => u.name).join(", ")}`, 20, 65)

      // Stats
      doc.setFontSize(14)
      doc.text("Umumiy ma'lumot:", 20, 85)
      doc.setFontSize(10)
      doc.text(`Umumiy xarajat: ${stats.totalSpent.toLocaleString()} so'm`, 20, 95)
      doc.text(`Har biriga: ${stats.averagePerPerson.toFixed(1)} so'm`, 20, 105)

      // Settlement details with improved formatting
      doc.setFontSize(14)
      doc.text("Hisob-kitob:", 20, 125)
      let yPos = 140
      doc.setFontSize(10)

      currentGroup.users.forEach((user, i) => {
        const receives: string[] = [] // Kim kimdan oladi
        const pays: string[] = [] // Kim kimga beradi

        currentGroup.users.forEach((otherUser, j) => {
          if (i !== j) {
            const amount = matrix[i][j]
            if (amount > 0) {
              pays.push(`${otherUser.name}ga ${amount.toFixed(1)} so'm`)
            } else if (amount < 0) {
              receives.push(`${otherUser.name}dan ${Math.abs(amount).toFixed(1)} so'm`)
            }
          }
        })

        if (receives.length > 0 || pays.length > 0) {
          if (yPos > 270) {
            doc.addPage()
            yPos = 20
          }

          doc.setFontSize(12)
          doc.text(`${user.name}:`, 20, yPos)
          yPos += 10

          doc.setFontSize(10)
          if (receives.length > 0) {
            const receivesText = `  Oladi: ${receives.join(", ")}`
            if (receivesText.length > 85) {
              const words = receivesText.split(" ")
              let currentLine = ""
              for (const word of words) {
                if ((currentLine + word).length > 85) {
                  doc.text(currentLine, 20, yPos)
                  yPos += 8
                  currentLine = "    " + word + " "
                } else {
                  currentLine += word + " "
                }
              }
              if (currentLine.trim()) {
                doc.text(currentLine, 20, yPos)
                yPos += 8
              }
            } else {
              doc.text(receivesText, 20, yPos)
              yPos += 8
            }
          }

          if (pays.length > 0) {
            const paysText = `  Beradi: ${pays.join(", ")}`
            if (paysText.length > 85) {
              const words = paysText.split(" ")
              let currentLine = ""
              for (const word of words) {
                if ((currentLine + word).length > 85) {
                  doc.text(currentLine, 20, yPos)
                  yPos += 8
                  currentLine = "    " + word + " "
                } else {
                  currentLine += word + " "
                }
              }
              if (currentLine.trim()) {
                doc.text(currentLine, 20, yPos)
                yPos += 8
              }
            } else {
              doc.text(paysText, 20, yPos)
              yPos += 8
            }
          }
          yPos += 5
        }
      })

      doc.save(`${currentGroup.name}-haftalik-hisob.pdf`)
    } catch (error) {
      console.error("PDF export error:", error)
      alert("PDF yaratishda xatolik yuz berdi")
    }
  }

  // Check if it's Sunday for weekly settlement
  const isSunday = new Date().getDay() === 0

  // Welcome Screen
  if (!isStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
                  <Calculator className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  SplitWise Pro
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <h2 className="text-xl font-semibold mb-4">Xush kelibsiz!</h2>
                <p className="text-gray-600 mb-6">Do&apos;stlar bilan xarajatlarni oson va aniq bo&apos;ling! 🎉</p>
                <div className="space-y-4 max-w-md mx-auto">
                  <div className="flex items-center gap-3 text-left">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-gray-700">Guruh yarating yoki qo&apos;shiling</span>
                  </div>
                  <div className="flex items-center gap-3 text-left">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-700">Kunlik xarajatlarni kiriting</span>
                  </div>
                  <div className="flex items-center gap-3 text-left">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Calculator className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="text-gray-700">Avtomatik hisob-kitob oling</span>
                  </div>
                </div>
                <Button onClick={handleStart} className="mt-8 px-8 py-3 text-lg">
                  Boshlash
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return (
      <AuthScreen
        mode={authMode}
        setMode={setAuthMode}
        form={authForm}
        setForm={setAuthForm}
        onAuth={handleAuth}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
      />
    )
  }

  if (!currentGroup) {
    return (
      <GroupSelection
      groups={groups.filter((g) => g.users.some((u) => u.id === currentUser.id))}
      onSelectGroup={(groupId) => {
      const group = groups.find((g) => g.id === groupId)
      if (group) setCurrentGroup(group)
  }}
  onCreateGroup={() => {
    setIsCreateGroupOpen(true);
    handleCreateGroup();
  }}
  onCreateGroupCallback={handleCreateGroup} // Provide the onCreateGroupCallback prop
  user={currentUser}
  onLogout={handleLogout}
  isDarkMode={isDarkMode}
  onToggleTheme={() => setIsDarkMode(!isDarkMode)}
  isCreateGroupOpen={isCreateGroupOpen}
  setIsCreateGroupOpen={setIsCreateGroupOpen}
  createGroupForm={createGroupForm}
  setCreateGroupForm={setCreateGroupForm}
/>
    )
  }

  const { matrix, stats } = calculateWeeklySettlement()

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode ? "dark bg-gray-900" : "bg-gradient-to-br from-blue-50 via-white to-purple-50"
      }`}
    >
      <div className="mx-auto max-w-7xl p-3 md:p-6 space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 md:p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
                <Calculator className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  SplitWise Pro
                </h1>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span>Guruh: {currentGroup.name}</span>
                  {currentUser.role === "admin" && <Shield className="w-4 h-4 text-blue-500" />}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsDarkMode(!isDarkMode)} className="p-2">
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            <Button variant="outline" size="sm" onClick={() => setIsFeedbackOpen(true)} className="p-2">
              <MessageSquare className="w-4 h-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={exportToPDF}
              disabled={!stats || stats.totalSpent === 0}
              className="flex items-center gap-1 px-2 md:px-4 bg-transparent"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">PDF</span>
            </Button>

            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Chiqish</span>
            </Button>
          </div>
        </div>

        {/* Admin Info */}
        {currentUser.role === "admin" && (
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">Access Code: </span>
                  <Badge variant="secondary" className="font-mono text-lg">
                    {currentGroup.accessCode}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Bu kodni a&apos;zolarga bering</div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sunday Settlement Alert */}
        {isSunday && stats && stats.totalSpent > 0 && (
          <Card className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-600" />
                <span className="font-medium text-orange-800 dark:text-orange-200">
                  Yakshanba kuni! Haftalik hisob-kitob vaqti keldi.
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        {stats && stats.totalSpent > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="p-3 md:p-4">
                <div className="flex items-center gap-2 md:gap-3">
                  <DollarSign className="w-6 h-6 md:w-8 md:h-8" />
                  <div>
                    <p className="text-blue-100 text-xs md:text-sm">Haftalik</p>
                    <p className="text-lg md:text-2xl font-bold">
                      {stats.totalSpent > 999
                        ? `${(stats.totalSpent / 1000).toFixed(1)}k`
                        : stats.totalSpent.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardContent className="p-3 md:p-4">
                <div className="flex items-center gap-2 md:gap-3">
                  <PieChart className="w-6 h-6 md:w-8 md:h-8" />
                  <div>
                    <p className="text-green-100 text-xs md:text-sm">Har biriga</p>
                    <p className="text-lg md:text-2xl font-bold">
                      {stats.averagePerPerson > 999
                        ? `${(stats.averagePerPerson / 1000).toFixed(1)}k`
                        : stats.averagePerPerson.toFixed(1)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardContent className="p-3 md:p-4">
                <div className="flex items-center gap-2 md:gap-3">
                  <Calendar className="w-6 h-6 md:w-8 md:h-8" />
                  <div>
                    <p className="text-purple-100 text-xs md:text-sm">Xarajatlar</p>
                    <p className="text-lg md:text-2xl font-bold">{currentGroup.dailyExpenses.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <CardContent className="p-3 md:p-4">
                <div className="flex items-center gap-2 md:gap-3">
                  <Users className="w-6 h-6 md:w-8 md:h-8" />
                  <div>
                    <p className="text-orange-100 text-xs md:text-sm">A&apos;zolar</p>
                    <p className="text-lg md:text-2xl font-bold">{currentGroup.users.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="daily" className="space-y-4 md:space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-lg mx-auto">
            <TabsTrigger value="daily" className="flex items-center gap-1 text-xs md:text-sm">
              <Plus className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Kunlik</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-1 text-xs md:text-sm">
              <Calendar className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Tarix</span>
            </TabsTrigger>
            <TabsTrigger value="settlement" className="flex items-center gap-1 text-xs md:text-sm">
              <ArrowRightLeft className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Hisob</span>
            </TabsTrigger>
            <TabsTrigger value="members" className="flex items-center gap-1 text-xs md:text-sm">
              <Users className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">A&apos;zolar</span>
            </TabsTrigger>
          </TabsList>

          {/* Daily Expenses Tab */}
          <TabsContent value="daily" className="space-y-4 md:space-y-6">
            <DailyExpenseTab
              form={expenseForm}
              setForm={setExpenseForm}
              categories={categories}
              onAddExpense={addDailyExpense}
            />
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4 md:space-y-6">
            <HistoryTab
              expenses={currentGroup.dailyExpenses}
              users={currentGroup.users}
              currentUser={currentUser}
              onDeleteExpense={deleteDailyExpense}
            />
          </TabsContent>

          {/* Settlement Tab */}
          <TabsContent value="settlement" className="space-y-4 md:space-y-6">
            <SettlementTab users={currentGroup.users} matrix={matrix} />
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members" className="space-y-4 md:space-y-6">
            <MembersTab group={currentGroup} currentUser={currentUser} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Feedback Dialog */}
      <Dialog open={isFeedbackOpen} onOpenChange={setIsFeedbackOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Fikr-mulohaza bildiring</DialogTitle>
            <DialogDescription>Ilovani yaxshilash uchun fikringizni bildiring</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Baho:</label>
              <div className="flex gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Button
                    key={star}
                    variant="ghost"
                    size="sm"
                    onClick={() => setFeedbackForm({ ...feedbackForm, rating: star })}
                    className="p-1"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= feedbackForm.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  </Button>
                ))}
              </div>
            </div>
            <Textarea
              placeholder="Fikringizni yozing..."
              value={feedbackForm.message}
              onChange={(e) => setFeedbackForm({ ...feedbackForm, message: e.target.value })}
              rows={4}
            />
            <div className="flex gap-2">
              <Button onClick={submitFeedback} disabled={!feedbackForm.message} className="flex-1">
                Yuborish
              </Button>
              <Button variant="outline" onClick={() => setIsFeedbackOpen(false)}>
                Bekor qilish
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Auth Screen Component - Simplified
function AuthScreen({
  mode,
  setMode,
  form,
  setForm,
  onAuth,
  isDarkMode,
  onToggleTheme,
}: {
  mode: "login" | "signup"
  setMode: (mode: "login" | "signup") => void
  form: AuthForm
  setForm: (form: AuthForm) => void
  onAuth: () => void
  isDarkMode: boolean
  onToggleTheme: () => void
}) {
  // Check if any groups exist - browser-safe
  const [hasGroups, setHasGroups] = useState(false)

  useEffect(() => {
    const groups = JSON.parse(localStorage.getItem("splitwise-groups") || "[]")
    setHasGroups(groups.length > 0)
  }, [])

  return (
    <div
      className={`min-h-screen transition-colors ${
        isDarkMode ? "dark bg-gray-900" : "bg-gradient-to-br from-blue-50 via-white to-purple-50"
      } flex items-center justify-center p-4`}
    >
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
                <Calculator className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                SplitWise Pro
              </h1>
            </div>
            <Button variant="outline" size="sm" onClick={onToggleTheme}>
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </div>
          <CardTitle>{mode === "login" ? "Kirish" : "Ro&apos;yxatdan o&apos;tish"}</CardTitle>
          <p className="text-gray-600 dark:text-gray-400">
            {mode === "login"
              ? "Hisobingizga kiring"
              : hasGroups
                ? "Guruhga qo'shiling"
                : "Birinchi admin ro'yhatdan o'tishingiz kerak"}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Ismingiz"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            type="email"
            placeholder="Email manzilingiz"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          {mode === "signup" && hasGroups && (
            <Input
              placeholder="Access Code (Admin dan oling)"
              value={form.accessCode}
              onChange={(e) => setForm({ ...form, accessCode: e.target.value.toUpperCase() })}
              className="font-mono"
            />
          )}

          {mode === "signup" && !hasGroups && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                🎉 Siz birinchi foydalanuvchisiz! Ro'yxatdan o'tganingizdan so'ng guruh yaratishingiz mumkin.
              </p>
            </div>
          )}

          <Button onClick={onAuth} className="w-full" disabled={!form.name || !form.email}>
            <LogIn className="w-4 h-4 mr-2" />
            {mode === "login" ? "Kirish" : "Ro'yxatdan o'tish"}
          </Button>

          <div className="text-center">
            <Button variant="link" onClick={() => setMode(mode === "login" ? "signup" : "login")} className="text-sm">
              {mode === "login" ? "Ro'yxatdan o'tish" : "Allaqachon hisobingiz bormi? Kirish"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Group Selection Component with Create Group Dialog
function GroupSelection({
  groups,
  onSelectGroup,
  onCreateGroup,
  user,
  onLogout,
  isDarkMode,
  onToggleTheme,
  isCreateGroupOpen,
  setIsCreateGroupOpen,
  createGroupForm,
  setCreateGroupForm,
  onCreateGroup: handleCreateGroup,
}: {
  groups: Group[]
  onSelectGroup: (id: string) => void
  onCreateGroup: () => void
  user: User
  onLogout: () => void
  isDarkMode: boolean
  onToggleTheme: () => void
  isCreateGroupOpen: boolean
  setIsCreateGroupOpen: (open: boolean) => void
  createGroupForm: CreateGroupForm
  setCreateGroupForm: (form: CreateGroupForm) => void
  onCreateGroupCallback: () => void
}) {
  return (
    <div
      className={`min-h-screen transition-colors ${
        isDarkMode ? "dark bg-gray-900" : "bg-gradient-to-br from-blue-50 via-white to-purple-50"
      } flex items-center justify-center p-4`}
    >
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Guruhlaringiz</CardTitle>
              <p className="text-gray-600 dark:text-gray-400">Salom, {user.name}!</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onToggleTheme}>
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              <Button variant="outline" size="sm" onClick={onLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {groups.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">Guruhlar yo&apos;q</h3>
              <p className="text-gray-500 dark:text-gray-500 mb-4">
                Guruh yarating yoki access code bilan qo&apos;shiling
              </p>
              <Button onClick={onCreateGroup}>
                <Plus className="w-4 h-4 mr-2" />
                Yangi guruh yaratish
              </Button>
            </div>
          ) : (
            <>
              <div className="grid gap-4">
                {groups.map((group) => (
                  <Card
                    key={group.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => onSelectGroup(group.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{group.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{group.description}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            {group.users.length} a&apos;zo • {group.dailyExpenses.length} xarajat
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {group.adminId === user.id && <Shield className="w-4 h-4 text-blue-500" />}
                          <Badge variant="secondary">{group.users.length}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Button onClick={onCreateGroup} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Yangi guruh yaratish
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Create Group Dialog */}
      <Dialog open={isCreateGroupOpen} onOpenChange={setIsCreateGroupOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Yangi guruh yaratish</DialogTitle>
            <DialogDescription>Yangi guruh yarating va access code oling</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Guruh nomi (masalan: Home41, Sinfdoshlar)"
              value={createGroupForm.name}
              onChange={(e) => setCreateGroupForm({ ...createGroupForm, name: e.target.value })}
            />
            <Textarea
              placeholder="Guruh tavsifi (ixtiyoriy)"
              value={createGroupForm.description}
              onChange={(e) => setCreateGroupForm({ ...createGroupForm, description: e.target.value })}
            />
            <div className="flex gap-2">
              <Button onClick={handleCreateGroup} disabled={!createGroupForm.name} className="flex-1">
                <UserPlus className="w-4 h-4 mr-2" />
                Guruh yaratish
              </Button>
              <Button variant="outline" onClick={() => setIsCreateGroupOpen(false)}>
                Bekor qilish
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Daily Expense Tab Component
function DailyExpenseTab({
  form,
  setForm,
  categories,
  onAddExpense,
}: {
  form: ExpenseForm
  setForm: (form: ExpenseForm) => void
  categories: string[]
  onAddExpense: () => void
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Kunlik xarajat qo&apos;shish
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            type="number"
            placeholder="Miqdor (so'm)"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />

          <Input
            placeholder="Nima uchun sarfladingiz?"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <Select value={form.category} onValueChange={(value) => setForm({ ...form, category: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        </div>

        <Button
          onClick={onAddExpense}
          disabled={!form.amount || !form.description}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Xarajat qo&apos;shish
        </Button>
      </CardContent>
    </Card>
  )
}

// History Tab Component
function HistoryTab({
  expenses,
  users,
  currentUser,
  onDeleteExpense,
}: {
  expenses: DailyExpense[]
  users: User[]
  currentUser: User
  onDeleteExpense: (id: string) => void
}) {
  const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Kunlik xarajatlar tarixi ({expenses.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {expenses.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Hozircha xarajat yo&apos;q</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sana</TableHead>
                  <TableHead>Kim</TableHead>
                  <TableHead>Tavsif</TableHead>
                  <TableHead>Kategoriya</TableHead>
                  <TableHead>Miqdor</TableHead>
                  <TableHead>Amal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedExpenses.map((expense) => {
                  const user = users.find((u) => u.id === expense.userId)
                  return (
                    <TableRow key={expense.id}>
                      <TableCell>{new Date(expense.date).toLocaleDateString("uz-UZ")}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {user?.name.charAt(0).toUpperCase()}
                          </div>
                          {user?.name}
                        </div>
                      </TableCell>
                      <TableCell>{expense.description}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{expense.category}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{expense.amount.toLocaleString()} so&apos;m</TableCell>
                      <TableCell>
                        {(expense.userId === currentUser.id || currentUser.role === "admin") && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDeleteExpense(expense.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Settlement Tab Component
function SettlementTab({
  users,
  matrix,
}: {
  users: User[]
  matrix: number[][]
}) {
  if (users.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Calculator className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">Hisob-kitob mavjud emas</h3>
          <p className="text-gray-500 dark:text-gray-500">Avval kunlik xarajatlarni kiriting</p>
        </CardContent>
      </Card>
    )
  }

  function grad(v: number) {
    const opacity = Math.min(60, Math.abs(v) * 2)
    return v > 0 ? `rgba(239,68,68,${opacity / 100})` : v < 0 ? `rgba(34,197,94,${opacity / 100})` : "transparent"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowRightLeft className="w-5 h-5" />
          Haftalik Hisob-kitob
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full max-h-[60vh]">
          <Table className="min-w-max text-sm">
            <TableHeader>
              <TableRow>
                <TableHead className="sticky left-0 bg-white dark:bg-gray-800 backdrop-blur z-10 min-w-[120px]" />
                {users.map((user) => (
                  <TableHead key={user.id} className="text-center min-w-[120px] font-medium">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-xs">{user.name}</span>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((rowUser, i) => (
                <TableRow key={rowUser.id}>
                  <TableHead className="font-medium sticky left-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur z-10 border-r">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {rowUser.name.charAt(0).toUpperCase()}
                      </div>
                      {rowUser.name}
                    </div>
                  </TableHead>
                  {users.map((colUser, j) => (
                    <TableCell
                      key={colUser.id}
                      style={{ backgroundColor: grad(matrix[i][j]) }}
                      className={`text-center font-medium border transition-all hover:scale-105 ${
                        i === j ? "bg-gray-50 dark:bg-gray-700" : ""
                      }`}
                    >
                      {i === j ? (
                        <span className="text-gray-400">-</span>
                      ) : (
                        <div className="space-y-1">
                          <div
                            className={`font-bold ${
                              matrix[i][j] > 0 ? "text-red-600" : matrix[i][j] < 0 ? "text-green-600" : "text-gray-400"
                            }`}
                          >
                            {matrix[i][j].toLocaleString()}
                          </div>
                          {matrix[i][j] !== 0 && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {matrix[i][j] > 0 ? "to&apos;laydi" : "oladi"}
                            </div>
                          )}
                        </div>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

// Members Tab Component
function MembersTab({ group }: { group: Group; currentUser: User }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Guruh a&apos;zolari ({group.users.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {group.users.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {user.role === "admin" && <Shield className="w-4 h-4 text-blue-500" />}
                <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                  {user.role === "admin" ? "Admin" : "A&apos;zo"}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
