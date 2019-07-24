#ifndef _CPUSOLVER_H_
#define _CPUSOLVER_H_

#include <atomic>
#include <mutex>
#include <string>
#include <vector>


/**
 * (CPU) Solver
 */
class CPUSolver
{
    public:
        typedef std::vector<uint8_t> bytes_t;

        /* Initialize constants. */
        static const unsigned short ADDRESS_LENGTH = 20u;
        static const unsigned short UINT256_LENGTH = 32u;

    /* Classes */
    public:
        CPUSolver() noexcept;

    /* Actions */
    public:
        bool trySolution(bytes_t const& solution);

    /* Setters */
    public:
        void setAddress(std::string const& addr);
        void setChallenge(std::string const& chal);
        void setTarget(std::string const& target);

    /* Utilities */
    public:
        static void hexToBytes(std::string const& hex, bytes_t& bytes);
        static std::string bytesToString(bytes_t const& buffer);
        static bool lte(bytes_t const& left, bytes_t const& right);

    /* Private Methods */
    private:
        void updateBuffer();
        void hash(bytes_t const& solution, bytes_t& digest);

    /* Private Variables. */
    private:
        bytes_t m_address;
        bytes_t m_challenge;
        bytes_t m_target, m_target_tmp;
        bytes_t m_buffer, m_buffer_tmp;

        std::mutex m_buffer_mutex;
        std::mutex m_target_mutex;
        std::atomic<bool> m_buffer_ready;
        std::atomic<bool> m_target_ready;

    /* Public Variables */
    public:
        static std::atomic<uint32_t> hashes;
};

#endif // !_CPUSOLVER_H_
