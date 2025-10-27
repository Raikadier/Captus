import { Calendar, BookOpen, Flame, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface TaskProps {
  task: {
    id: number
    title: string
    dueDate: string
    priority: string
    status: string
    subject: string
  }
}

export default function TaskCard({ task }: TaskProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const getPriorityConfig = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "alta":
        return {
          color: "bg-red-100 text-red-800 hover:bg-red-100",
          icon: <Flame size={14} className="mr-1" />,
          borderColor: "border-l-red-500",
        }
      case "media":
        return {
          color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
          icon: <Zap size={14} className="mr-1" />,
          borderColor: "border-l-yellow-500",
        }
      case "baja":
        return {
          color: "bg-blue-100 text-blue-800 hover:bg-blue-100",
          icon: null,
          borderColor: "border-l-blue-500",
        }
      default:
        return {
          color: "bg-gray-100 text-gray-800 hover:bg-gray-100",
          icon: null,
          borderColor: "border-l-gray-500",
        }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pendiente":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
      case "en progreso":
        return "bg-green-50 text-green-700 hover:bg-green-50"
      case "completada":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  const priorityConfig = getPriorityConfig(task.priority)

  return (
    <div
      className={`p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all bg-white border-l-4 ${priorityConfig.borderColor}`}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-gray-900 text-base">{task.title}</h3>
        <div className="flex space-x-2">
          <Badge variant="outline" className={priorityConfig.color}>
            {priorityConfig.icon}
            {task.priority}
          </Badge>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 text-sm text-gray-500">
        <div className="flex items-center bg-[#F6F7FB] px-2 py-1 rounded-lg">
          <Calendar size={14} className="mr-1.5 text-green-600" />
          <span>{formatDate(task.dueDate)}</span>
        </div>
        <div className="flex items-center bg-[#F6F7FB] px-2 py-1 rounded-lg">
          <BookOpen size={14} className="mr-1.5 text-green-600" />
          <span>{task.subject}</span>
        </div>
        <Badge variant="outline" className={getStatusColor(task.status)}>
          {task.status}
        </Badge>
      </div>
    </div>
  )
}
