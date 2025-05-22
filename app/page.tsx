import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Dashboard from "@/components/dashboard"
import Simulation from "@/components/simulation"
import RegionalAnalysis from "@/components/regional-analysis"
import DataAnalysis from "@/components/data-analysis"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-2">기후변화 대응을 위한 신재생에너지 분석</h1>
        <p className="text-center text-gray-600 mb-8">신재생에너지 계약 현황 추이 분석 및 탄소 중립 예측 시뮬레이션</p>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">대시보드</TabsTrigger>
            <TabsTrigger value="simulation">시뮬레이션</TabsTrigger>
            <TabsTrigger value="regional">지역별 분석</TabsTrigger>
            <TabsTrigger value="analysis">데이터 분석</TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard">
            <Dashboard />
          </TabsContent>
          <TabsContent value="simulation">
            <Simulation />
          </TabsContent>
          <TabsContent value="regional">
            <RegionalAnalysis />
          </TabsContent>
          <TabsContent value="analysis">
            <DataAnalysis />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
