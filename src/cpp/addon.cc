/*********************************************************************
 * NAN - Native Abstractions for Node.js
 *
 * Copyright (c) 2017 NAN contributors
 *
 * MIT License <https://github.com/nodejs/nan/blob/master/LICENSE.md>
 ********************************************************************/

#include <nan.h>

#include "hybrid_ministo.h"


/**
 * Ministo (Namespace)
 */
namespace ministo {
    /* Use NAN namespace. */
    using namespace Nan;

    /* Initialize "hybrid" ministo miner. */
    ::HybridMinisto* hybrid_ministo = nullptr;

    /* Call C++ dtors: */
    void cleanup(void* p) {
        delete reinterpret_cast<HybridMinisto*>(p);
    }


    /**
     * Ministo (Class)
     */
    class Ministo : public AsyncWorker {
        public:
            Ministo(Callback *callback)
            : AsyncWorker(callback)
            { }

            ~Ministo() {}

            // NOTE: This function runs in a thread spawned by NAN.
            void Execute () {
                if (hybrid_ministo) {
                    hybrid_ministo->run(); // blocking call
                } else {
                    SetErrorMessage("{ error: 'no hybrid_ministo!' }");
                }
            }

        private:
            /**
             * Executed when the async work is complete
             * this function will be run inside the main event loop
             * so it is safe to use V8 again.
             */
            void HandleOKCallback () {
                HandleScope scope;

                v8::Local<v8::Value> argv[] = {
                    Null(),
                    New<v8::String>(hybrid_ministo->solution()).ToLocalChecked()
                };

                callback->Call(2, argv);
            }
    };

    /**
     * Run an asynchronous function.
     *
     * NOTE: First and only parameter is a callback function
     * receiving the solution when found.
     */
    NAN_METHOD(run) {
        Callback *callback = new Callback(To<v8::Function>(info[0]).ToLocalChecked());

        AsyncQueueWorker(new Ministo(callback));
    }

    /**
     * Stop an asynchronous function.
     */
    NAN_METHOD(stop) {
        hybrid_ministo->stop();

        info.GetReturnValue().SetUndefined();
    }

    /**
     * Set Hardware Type
     */
    NAN_METHOD(setHardwareType) {
        MaybeLocal<v8::String> inp = Nan::To<v8::String>(info[0]);

        if (!inp.IsEmpty()) {
            hybrid_ministo->setHardwareType(std::string(*Nan::Utf8String(inp.ToLocalChecked())));
        }

        info.GetReturnValue().SetUndefined();
    }

    /**
     * Set Thread Size
     */
    NAN_METHOD(setThreadsize) {
        MaybeLocal<v8::String> inp = Nan::To<v8::String>(info[0]);

        if (!inp.IsEmpty()) {
            hybrid_ministo->setThreadsize(std::string(*Nan::Utf8String(inp.ToLocalChecked())));
        }

        info.GetReturnValue().SetUndefined();
    }

    /**
     * Set Block Size
     */
    NAN_METHOD(setBlocksize) {
        MaybeLocal<v8::String> inp = Nan::To<v8::String>(info[0]);

        if (!inp.IsEmpty()) {
            hybrid_ministo->setBlocksize(std::string(*Nan::Utf8String(inp.ToLocalChecked())));
        }

        info.GetReturnValue().SetUndefined();
    }

    /**
     * Set Challenge Number
     */
    NAN_METHOD(setChallengeNumber) {
        MaybeLocal<v8::String> inp = Nan::To<v8::String>(info[0]);

        if (!inp.IsEmpty()) {
            hybrid_ministo->setChallengeNumber(std::string(*Nan::Utf8String(inp.ToLocalChecked())));
        }

        info.GetReturnValue().SetUndefined();
    }

    /**
     * Set Difficulty Target
     */
    NAN_METHOD(setDifficultyTarget) {
        MaybeLocal<v8::String> inp = Nan::To<v8::String>(info[0]);

        if (!inp.IsEmpty()) {
            hybrid_ministo->setDifficultyTarget(std::string(*Nan::Utf8String(inp.ToLocalChecked())));
        }

        info.GetReturnValue().SetUndefined();
    }

    /**
     * Set Ministo Address
     */
    NAN_METHOD(setMinterAddress) {
        MaybeLocal<v8::String> inp = Nan::To<v8::String>(info[0]);

        if (!inp.IsEmpty()) {
            hybrid_ministo->setMinterAddress(std::string(*Nan::Utf8String(inp.ToLocalChecked())));
        }

        info.GetReturnValue().SetUndefined();
    }

    /**
     * Get Number of Hashes (performed until now),
     * then reset it to 0.
     *
     * TODO: Need to make one of these for the gpu solver.. ?
     */
    NAN_METHOD(hashes) {
        uint32_t const value = CPUSolver::hashes;

        CPUSolver::hashes = 0;

        info.GetReturnValue().Set(value);
    }

    /**
     * Defines the functions our add-on will export.
     */
    NAN_MODULE_INIT(Init) {
        Set(target
            , New<v8::String>("run").ToLocalChecked()
            , New<v8::FunctionTemplate>(run)->GetFunction()
        );

        Set(target
            , New<v8::String>("stop").ToLocalChecked()
            , New<v8::FunctionTemplate>(stop)->GetFunction()
        );

        Set(target
            , New<v8::String>("setBlocksize").ToLocalChecked()
            , New<v8::FunctionTemplate>(setBlocksize)->GetFunction()
        );

        Set(target
            , New<v8::String>("setThreadsize").ToLocalChecked()
            , New<v8::FunctionTemplate>(setThreadsize)->GetFunction()
        );

        Set(target
            , New<v8::String>("setHardwareType").ToLocalChecked()
            , New<v8::FunctionTemplate>(setHardwareType)->GetFunction()
        );

        Set(target
            , New<v8::String>("setChallengeNumber").ToLocalChecked()
            , New<v8::FunctionTemplate>(setChallengeNumber)->GetFunction()
        );

        Set(target
            , New<v8::String>("setDifficultyTarget").ToLocalChecked()
            , New<v8::FunctionTemplate>(setDifficultyTarget)->GetFunction()
        );

        Set(target
            , New<v8::String>("setMinterAddress").ToLocalChecked()
            , New<v8::FunctionTemplate>(setMinterAddress)->GetFunction()
        );

        Set(target
            , New<v8::String>("hashes").ToLocalChecked()
            , New<v8::FunctionTemplate>(hashes)->GetFunction()
        );

        hybrid_ministo = new HybridMinisto;

        node::AtExit(cleanup, hybrid_ministo);
    }

    NODE_MODULE(hybrid_ministo, Init)
}
