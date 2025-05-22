'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useEffect, useState } from 'react';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts';

// Mock data for carbon emissions
const carbonData = [
    { year: 2018, emissions: 650, avoided: 120 },
    { year: 2019, emissions: 630, avoided: 150 },
    { year: 2020, emissions: 600, avoided: 180 },
    { year: 2021, emissions: 580, avoided: 220 },
    { year: 2022, emissions: 550, avoided: 260 },
    { year: 2023, emissions: 520, avoided: 310 },
];

const regions = [
    '강원',
    '경기',
    '경남',
    '경북',
    '광주',
    '대구',
    '대전',
    '부산',
    '서울',
    '인천',
    '전남',
    '전북',
    '제주',
    '충남',
    '충북',
];
const COLORS = ['#FF8042', '#FFBB28', '#0088FE', '#00C49F', '#AAAAAA'];

export default function Dashboard() {
    const selfSufficiencyTarget = 70;

    const [data, setData] = useState({
        self_sufficiency: 0,
        avg_carbon_avoidance: 0,
        carbon_avoidance_growth_rate: 0,
        ratio: 0,
        ratio_growth_rate: 0,
        latest_growth_rate: 0,
    });

    const [contractData, setContractData] = useState([]);
    const [energyData, setEnergyData] = useState([]);
    const [efficiencyData, setEfficiencyData] = useState<{ region: string; efficiency: number }[]>([]);

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    useEffect(() => {
        async function fetchDashboardData() {
            try {
                const res = await fetch(`${API_BASE_URL}/dashboard`);
                const json = await res.json();
                setData(json);
            } catch (error) {
                console.error('Failed to fetch dashboard data', error);
            }
        }
        fetchDashboardData();

        async function fetchContractData() {
            try {
                const res = await fetch(`${API_BASE_URL}/contract`);
                const json = await res.json();
                setContractData(json);
            } catch (error) {
                console.error('Failed to fetch contract data', error);
            }
        }

        fetchContractData();

        async function fetchEnergyData() {
            try {
                const res = await fetch(`${API_BASE_URL}/energy`);
                const json = await res.json();
                setEnergyData(json);
            } catch (error) {
                console.error('Failed to fetch energy data', error);
            }
        }

        fetchEnergyData();

        async function fetchEfficiencyData() {
            try {
                const res = await fetch(`${API_BASE_URL}/efficiency`);
                const json = await res.json();

                // 효율값을 지역과 함께 배열로 변환
                const data = Object.entries(json.efficiency).map(([region, efficiency]) => ({
                    region,
                    efficiency: efficiency as number,
                }));

                setEfficiencyData(data); // 상태 업데이트
            } catch (error) {
                console.error('Failed to fetch efficiency data', error);
            }
        }

        fetchEfficiencyData();
    }, []);

    function getColorForRegion(region: string): string {
        const colors: Record<string, string> = {
            강원: '#8884d8',
            경기: '#82ca9d',
            경남: '#ffc658',
            경북: '#ff7300',
            광주: '#0088FE',
            대구: '#00C49F',
            대전: '#FF8042',
            부산: '#A28FD0',
            서울: '#D0ED57',
            인천: '#8DD1E1',
            전남: '#E377C2',
            전북: '#FFBB28',
            제주: '#00A86B',
            충남: '#FF6699',
            충북: '#99CCFF',
        };

        return colors[region] || '#000000'; // 기본 검정색
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-full">
                <CardHeader>
                    <CardTitle>신재생에너지 현황 대시보드</CardTitle>
                    <CardDescription>국내 신재생에너지 계약 현황 및 탄소 배출량 추이</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div className="space-y-2">
                            <div className="text-sm font-medium">신재생에너지기반 자립도</div>
                            <div className="text-2xl font-bold">{data.self_sufficiency}%</div>
                            <Progress value={data.self_sufficiency} className="h-2" />
                            <div className="text-xs text-muted-foreground">목표: 2030년까지 30%</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-sm font-medium">전체 에너지원 중 신재생 에너지 비율</div>
                            <div className="text-2xl font-bold">{data.ratio}%</div>
                            <div className="text-xs text-green-600">{data.ratio_growth_rate}%</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-sm font-medium">탄소 회피량</div>
                            <div className="text-2xl font-bold">
                                {(data.avg_carbon_avoidance / 1_000_000).toFixed(2)} MtCO₂
                            </div>
                            <div className="text-xs text-green-600">{data.carbon_avoidance_growth_rate}%</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-sm font-medium">계약 증가율</div>
                            <div className="text-2xl font-bold">{data.latest_growth_rate}%</div>
                            <div className="text-xs text-muted-foreground">{new Date().getFullYear()}년 기준</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="col-span-2">
                <CardHeader>
                    <CardTitle>신재생에너지 계약 추이</CardTitle>
                    <CardDescription>연도별 신재생에너지 계약량 (단위: MW)</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={contractData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" />
                            <YAxis />
                            <Tooltip />
                            <Legend wrapperStyle={{ fontSize: '12px' }} />

                            {regions.map((region) => (
                                <Line
                                    key={region}
                                    type="linear"
                                    dataKey={region}
                                    stroke={getColorForRegion(region)} // 필요하면 색상 함수 사용
                                    dot={{ r: 3 }}
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>에너지 믹스 현황</CardTitle>
                    <CardDescription>2023년 기준 에너지원별 비중</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={energyData}
                                cx="50%"
                                cy="50%"
                                labelLine={true}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {energyData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => `${value}`} />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card className="col-span-full">
                <CardHeader>
                    <CardTitle>지역별 설비 효율성 (평균 이용률)</CardTitle>
                    <CardDescription>
                        지역별 재생 가능 에너지 설비의 평균 이용률을 통해 설비 효율성을 비교하며,
                        <br />
                        <span style={{ color: 'green' }}> 높은 이용률은 효율적인 운영을, </span>
                        <span style={{ color: 'red' }}> 낮은 이용률은 개선이 필요함을 나타냅니다.</span>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                            data={efficiencyData}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 30,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="region" angle={-45} textAnchor="end" height={60} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="efficiency" name="이용률 (%)" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
