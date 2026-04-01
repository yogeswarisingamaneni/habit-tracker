import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, Zap, BarChart2, Shield, ArrowRight } from 'lucide-react';

export default function Landing() {
  return (
    <div className="flex flex-col items-center pt-12 pb-24">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-4xl"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          V1.0 IS NOW LIVE
        </div>
        <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Master your habits, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
            Elevate your life.
          </span>
        </h1>
        <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          The premium habit tracker designed for high-performers. Track streaks, analyze progress, and level up your productivity with HabitFlow.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/auth" 
            className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-500/30 flex items-center justify-center gap-2 group"
          >
            Start Your Journey <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a 
            href="#features" 
            className="px-8 py-4 bg-slate-900 text-slate-300 font-bold rounded-xl border border-slate-800 hover:bg-slate-800 transition-all flex items-center justify-center"
          >
            Explore Features
          </a>
        </div>
      </motion.div>

      {/* Stats/Social Proof */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-5xl"
      >
        {[
          { label: 'Active Users', value: '10k+' },
          { label: 'Habits Tracked', value: '1M+' },
          { label: 'Success Rate', value: '85%' },
          { label: 'Average Streak', value: '14 Days' },
        ].map((stat, i) => (
          <div key={i} className="text-center p-6 rounded-2xl bg-slate-900/50 border border-slate-800/50">
            <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Features Grid */}
      <div id="features" className="mt-32 w-full max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Everything you need to succeed</h2>
          <p className="text-slate-400">Powerful tools to help you build lasting routines.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Zap className="w-6 h-6 text-indigo-400" />,
              title: 'Streak Tracking',
              desc: 'Visual streaks that keep you motivated. Don\'t break the chain.'
            },
            {
              icon: <BarChart2 className="w-6 h-6 text-cyan-400" />,
              title: 'Advanced Analytics',
              desc: 'Detailed insights into your progress with beautiful charts and heatmaps.'
            },
            {
              icon: <Shield className="w-6 h-6 text-emerald-400" />,
              title: 'Gamified Experience',
              desc: 'Earn XP, level up, and unlock achievements as you complete your habits.'
            }
          ].map((feature, i) => (
            <div key={i} className="p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
