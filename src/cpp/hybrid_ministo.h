/*******************************************************************************
 * Header file to declare prototypes
 */

#ifndef  _HYBRIDMINISTO_H_
#define  _HYBRIDMINISTO_H_

#include "cpu/solver.h"
// #include "cuda/solver.h"

#include <thread>
#include <string.h>

/**
 * HybridMinisto
 */
class HybridMinisto
{
    public:
        HybridMinisto() noexcept;
        ~HybridMinisto();

    public:
        void setChallenge(std::string const& challenge);
        void setTarget(std::string const& target);
        void setMinterAddress(std::string const& minterAddress);

        /* Only used if CUDA mining. */
        void setBlockSize(std::string const& blocksize);
        void setThreadSize(std::string const& threadsize);
        void setHardwareType(std::string const& hardwareType);

    public:
        void run();
        void stop();
        void cudaTest();

        std::string solution() const;

    private:
        void thr_func(CPUSolver& solver);

        void solutionFound(CPUSolver::bytes_t const& solution);

        // set a var in the solver !!

    private:
        void set(void (CPUSolver::*fn)(std::string const&), std::string const& p);

    private:
        std::vector<CPUSolver> m_solvers;
        std::vector<std::thread> m_threads;

        // CUDASolver cudaSolver;

        std::mutex m_solution_mutex;

        CPUSolver::bytes_t m_solution; // make one for GPU ?

        // GPUSolver gpuSolver;

        bool m_bSolutionFound;

        std::string m_hardwareType;

        volatile bool m_bExit;
};

#endif // ! _CPUMINER_H_
