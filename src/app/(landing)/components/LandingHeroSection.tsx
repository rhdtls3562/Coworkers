/**
 * 랜딩 페이지의 첫 화면 히어로 영역을 렌더링하는 컴포넌트입니다.
 */

import Image from 'next/image';
import Link from 'next/link';

import LandingScrollReveal from '@/app/(landing)/components/LandingScrollReveal';
import { imgLandingDashboard, ImgLogoSymbolLarge } from '@/assets';
import Logo from '@/components/common/logo/Logo';
import { ROUTES } from '@/constants/ROUTES';

export default function LandingHeroSection() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-background-secondary py-10 md:py-12 lg:py-20">
      <div className="flex w-full flex-col gap-12 lg:flex-row lg:items-center lg:gap-0">
        <LandingScrollReveal
          animateOnMount
          direction="left"
          className="flex shrink-0 flex-col items-start gap-16 pl-6 md:pl-12 lg:ml-32 lg:pl-0 xl:ml-40"
        >
          <div className="flex flex-col items-start gap-4">
            <ImgLogoSymbolLarge
              width={35}
              height={24}
              className="h-auto w-16"
              style={{ height: 'auto' }}
              aria-hidden="true"
            />
            <p className="text-sm font-medium text-interaction-inactive lg:text-xl">
              함께 만들어가는 To do list
            </p>
            <h1>
              <Link href={ROUTES.HOME} aria-label="Coworkers 홈으로 이동">
                <Logo size="small" className="lg:hidden" />
                <Logo size="large" className="hidden lg:block" />
              </Link>
            </h1>
          </div>
          {/* 데스크탑 버튼 */}
          <Link
            href={ROUTES.LOGIN}
            className="hidden h-10 w-32 items-center justify-center rounded-lg bg-brand-primary text-sm font-semibold text-text-inverse transition-colors hover:bg-interaction-hover md:h-12 md:w-40 md:text-base lg:mt-116.25 lg:flex"
          >
            지금 시작하기
          </Link>
        </LandingScrollReveal>

        <div className="ml-auto w-11/12 lg:ml-[min(25rem,10vw)] lg:w-auto lg:flex-1">
          <div className="rounded-l-2xl shadow-xl shadow-text-default/10">
            <Image
              src={imgLandingDashboard}
              alt="팀 대시보드와 할 일 목록 예시"
              loading="eager"
              className="w-full min-w-180 rounded-l-2xl object-contain md:min-w-200"
              sizes="(min-width: 1024px) calc(100vw - 320px), 90vw"
            />
          </div>
          {/* 태블릿/모바일 버튼 */}
          <div className="mt-6 flex justify-end pr-6 lg:hidden">
            <Link
              href={ROUTES.LOGIN}
              className="mt-5 flex h-10 w-32 items-center justify-center rounded-lg bg-brand-primary text-sm font-semibold text-text-inverse transition-colors hover:bg-interaction-hover md:h-12 md:w-40 md:text-base"
            >
              지금 시작하기
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
