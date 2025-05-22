'use client';

import { useEffect, useState } from 'react';

export default function KoreaMap() {
    const [energySource, setEnergySource] = useState('신재생에너지 합계'); // 기본 값은 '신재생에너지합계'
    const [mapHtml, setMapHtml] = useState<string>(''); // 지도 HTML 상태 추가

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    useEffect(() => {
        async function fetchMapData() {
            try {
                // energySource에 맞는 URL로 지도 HTML을 가져옴
                const res = await fetch(`${API_BASE_URL}/region/${energySource}`);
                const html = await res.text(); // HTML 데이터를 텍스트로 가져옴
                setMapHtml(html); // HTML 상태 업데이트
            } catch (error) {
                console.error('Failed to fetch map data', error);
            }
        }
        fetchMapData();
    }, [energySource]); // energySource 값이 바뀔 때마다 새로 데이터를 요청

    const handleEnergySourceChange = (source: string) => {
        setEnergySource(source); // 에너지 유형 변경
    };

    return (
        <div className="relative border rounded-md p-4 bg-white">
            <h3 className="text-center font-medium mb-4">지역별 신재생에너지 발전</h3>

            {/* 에너지 유형 선택 버튼 */}
            <div className="flex justify-center gap-4 mb-4">
                <button
                    onClick={() => handleEnergySourceChange('신재생에너지 합계')}
                    className={`px-4 py-2 rounded-md text-white ${
                        energySource === '신재생에너지 합계' ? 'bg-green-500' : 'bg-gray-400'
                    } hover:bg-green-700 transition duration-200`}
                >
                    신재생에너지 합계
                </button>
                <button
                    onClick={() => handleEnergySourceChange('태양광')}
                    className={`px-4 py-2 rounded-md text-white ${
                        energySource === '태양광' ? 'bg-green-500' : 'bg-gray-400'
                    } hover:bg-green-700 transition duration-200`}
                >
                    태양광
                </button>
                <button
                    onClick={() => handleEnergySourceChange('풍력')}
                    className={`px-4 py-2 rounded-md text-white ${
                        energySource === '풍력' ? 'bg-green-500' : 'bg-gray-400'
                    } hover:bg-green-700 transition duration-200`}
                >
                    풍력
                </button>
                <button
                    onClick={() => handleEnergySourceChange('수력')}
                    className={`px-4 py-2 rounded-md text-white ${
                        energySource === '풍력' ? 'bg-green-500' : 'bg-gray-400'
                    } hover:bg-green-700 transition duration-200`}
                >
                    수력
                </button>
                <button
                    onClick={() => handleEnergySourceChange('바이오')}
                    className={`px-4 py-2 rounded-md text-white ${
                        energySource === '풍력' ? 'bg-green-500' : 'bg-gray-400'
                    } hover:bg-green-700 transition duration-200`}
                >
                    바이오
                </button>
                <button
                    onClick={() => handleEnergySourceChange('재생폐기물')}
                    className={`px-4 py-2 rounded-md text-white ${
                        energySource === '풍력' ? 'bg-green-500' : 'bg-gray-400'
                    } hover:bg-green-700 transition duration-200`}
                >
                    재생폐기물
                </button>
            </div>

            {/* 지도 표시 영역 */}
            <div className="map-container">
                {/* 지도 HTML을 받아와서 dangerouslySetInnerHTML로 렌더링 */}
                {mapHtml ? <div dangerouslySetInnerHTML={{ __html: mapHtml }} /> : <p>데이터를 로딩 중입니다...</p>}
            </div>
        </div>
    );
}
